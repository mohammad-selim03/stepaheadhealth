import { useTranslation } from "react-i18next";
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  useContext,
} from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { State } from "country-state-city";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostData } from "../../../../api/API";
import toast from "react-hot-toast";
import { MainContext } from "../../../../provider/ContextProvider";
import Loader from "../../../common/Loader";

type Inputs = {
  pharmacy: string;
  city: string;
  state: string;
  zip: string;
  name: string;
};

type PharmacyOption = {
  value: string;
  label: string;
  name: string;
  state: string;
  city: string;
  zip: string;
  pharmacyData: any;
};
type confrimPharmacyType = {
  dosespotId?: number;
  storeName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  primaryPhone?: number;
  primaryPhoneType?: string;
  primaryFax?: number;
  ncpdpId?: number;
};
type RawPharmacyType = {
  PharmacyId?: number;
  StoreName?: string;
  Address1?: string;
  Address2?: string;
  City?: string;
  State?: string;
  ZipCode?: number;
  PrimaryPhone?: number;
  PrimaryPhoneType?: string;
  PrimaryFax?: number;
  NCPDPID?: number;
};

type Setp3Handle = {
  submit: () => void;
};

const Setp3 = forwardRef<Setp3Handle, { onNext: (data: Inputs) => void }>(
  ({ onNext, changePharmacy, setIsModalOpen }, ref) => {
    const { t } = useTranslation("patientdashboard");
    const [selectedPharmacy, setSelectedPharmacy] =
      useState<RawPharmacyType | null>(null);
    const [showPharmacyDetails, setShowPharmacyDetails] = useState(false);
    const [pharmacyList, setPharmacyList] = useState<RawPharmacyType | []>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setConfirmed] = useState(false);
    const [isVisible, setVisible] = useState(false);

    const info = JSON.parse(localStorage.getItem("info") || "null");

    const {
      control,
      handleSubmit,
      register,
      formState: { errors },
      watch,
      setValue,
      getValues,
    } = useForm<Inputs>({
      defaultValues: {
        pharmacy: "",
        name: "",
        // city: info?.city || "",
        state: info?.state || "",
        zip: info?.zipCode || "",
      },
    });
    console.log("selected pharmacy", selectedPharmacy);
    // Watch pharmacy value to show details when selected
    const pharmacyValue = watch("pharmacy");
    const stateValue = watch("state");

    // Expose submit function via ref
    useImperativeHandle(ref, () => ({
      submit: () => {
        if (!selectedPharmacy) {
          toast.error("Please select a pharmacy first");
          return;
        }
        handleSubmit(onSubmit)();
      },
    }));

    const US_STATE_COUNTRY_CODE = "US";
    const stateOptions = useMemo(() => {
      return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
    }, []);

    // Update localStorage when state changes
    useEffect(() => {
      if (stateValue) {
        localStorage.setItem("state", JSON.stringify(stateValue));
      }
    }, [stateValue]);

    const getPharmacy = async (
      searchName = "",
      // searchCity = "",
      searchZip = "",
      searchState = ""
    ) => {
      try {
        console.log("getPharmacy called with:", {
          searchName,
          // searchCity,
          searchZip,
          searchState,
        });
        const localstate = JSON.parse(localStorage.getItem("state") || "null");
        let queryString = "";
        // if (searchCity) queryString += `city=${searchCity}`;
        if (searchName)
          queryString += `${queryString ? "&" : ""}name=${searchName}`;
        if (searchZip)
          queryString += `${queryString ? "&" : ""}zip=${searchZip}`;
        if (searchState || localstate) {
          queryString += `${queryString ? "&" : ""}state=${
            searchState || localstate
          }`;
        }
        console.log("Final query string:", queryString);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/pharmacy/dosespot/search${
            queryString ? `?${queryString}` : ""
          }`
        );

        const items = response?.data?.data?.Items || [];
        setPharmacyList(items);

        const transformedOptions: PharmacyOption[] = items.map(
          (pharmacy: any, index: number) => ({
            value: `pharmacy-${pharmacy?.PharmacyId || index}`,
            label: pharmacy?.StoreName || `Pharmacy ${index + 1}`,
            state: pharmacy?.State || "",
            zip: pharmacy?.ZipCode || "",
            // city: pharmacy?.City || "",
            pharmacyData: pharmacy,
          })
        );
        return transformedOptions;
      } catch (error) {
        console.log("err", error);
        return [];
      }
    };

    const [pharmacyOptions, setPharmacyOptions] = useState<PharmacyOption[]>(
      []
    );

    useEffect(() => {
      const fetchPharmacies = async () => {
        const options = await getPharmacy();
        setPharmacyOptions(options);
      };
      fetchPharmacies();
    }, []);

    // When pharmacy selection changes
    useEffect(() => {
      if (pharmacyValue) {
        const selected = pharmacyOptions.find(
          (opt) => opt.value === pharmacyValue
        );
        if (selected) {
          setSelectedPharmacy(selected.pharmacyData);
          setShowPharmacyDetails(true);
          setValue("name", selected.pharmacyData.StoreName);
          // setValue("city", selected?.city);
          setValue("state", selected?.state);
          setValue("zip", selected?.zip);
        }
      }
    }, [pharmacyValue, pharmacyOptions, setValue]);

    const searchPharmacies = async () => {
      const { name, state, zip, city } = getValues();

      if (!name && !state && !zip || !city) {
        toast.error(
          "Please provide at least one search criteria (city, state, or zip code)"
        );
        return;
      }

      setIsLoading(true);
      setShowSearchResults(false);
      setShowPharmacyDetails(false);
      setSelectedPharmacy(null);
      setValue("pharmacy", "");

      try {
        const items = await getPharmacy(name, zip, state);
        setPharmacyOptions(items);
        setShowSearchResults(true);
      } catch (error) {
        console.log("Search error:", error);
        toast.error("Error searching pharmacies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSelectPharmacy = (pharmacy: any) => {
      const pharmacyOption = pharmacyOptions.find(
        (opt) => opt.pharmacyData.PharmacyId === pharmacy.PharmacyId
      );
      console.log("phar", pharmacy);
      if (pharmacyOption) {
        setValue("pharmacy", pharmacyOption.value);
        setSelectedPharmacy(pharmacy);
        setShowPharmacyDetails(true);
        setShowSearchResults(false);
        // Auto-fill other fields
        setValue("name", pharmacy.StoreName || "");
        setValue("city", pharmacy.City || "");
        setValue("state", pharmacy.State || "");
        setValue("zip", pharmacy.ZipCode || "");
      }
    };

    const handleConfirmPharmacy = () => {
      const data: confrimPharmacyType = {
        dosespotId: selectedPharmacy?.PharmacyId,
        storeName: selectedPharmacy?.StoreName,
        address1: selectedPharmacy?.Address1,
        address2: selectedPharmacy?.Address2,
        city: selectedPharmacy?.City,
        state: selectedPharmacy?.State,
        zipCode: selectedPharmacy?.ZipCode,
        primaryPhone: selectedPharmacy?.PrimaryPhone,
        primaryPhoneType: selectedPharmacy?.PrimaryPhoneType,
        primaryFax: selectedPharmacy?.PrimaryFax,
        ncpdpId: selectedPharmacy?.NCPDPID,
      };
      setData((prev) => ({
        ...prev,
      }));
      confirmPharmacy.mutate(data);
    };

    const onSubmit = (data: Inputs) => {
      if (!selectedPharmacy) {
        toast.error("Please select a pharmacy first");
        return;
      }
      console.log("Form submitted with data:", data);
      if (!changePharmacy) {
        onNext(data);
      }
      handleConfirmPharmacy();
    };

    const handleSelectPharmacyButton = () => {
      if (!pharmacyValue) {
        toast.error("Please select a pharmacy first");
        return;
      }
      setShowPharmacyDetails(true);
    };

    const { setData } = useContext(MainContext);
    const queryClient = useQueryClient();
    const confirmPharmacy = useMutation({
      mutationKey: ["confirmPharmacy"],
      mutationFn: (payload: confrimPharmacyType) =>
        PostData("/pharmacy", payload),
      onSuccess: (data) => {
        console.log("dataa", data);
        toast.success(data?.message || "Pharmacy confirmed");
        setConfirmed(true);
        if (changePharmacy) setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["pharmacy"] });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });

    return (
      <div className="">
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          Pharmacy Details
        </p>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Pharmacy select */}
          {!isVisible && (
            <div className="mb-7">
              <label className="text-textPrimary font-nerisSemiBold">
                Select Pharmacy
                <span className="text-textSecondary font-Poppins font-light">
                  {" "}
                  (Based on your address)
                </span>
              </label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="pharmacy"
                  rules={{ required: "Pharmacy is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={pharmacyOptions}
                      placeholder="Select Pharmacy"
                      isClearable
                      onChange={(val) => {
                        field.onChange(val?.value ?? "");
                        setShowPharmacyDetails(false);
                        setShowSearchResults(false);
                      }}
                      value={
                        pharmacyOptions.find(
                          (opt) => opt.value === field.value
                        ) ?? null
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.pharmacy ? " " : "#E5E5E5",
                          borderRadius: 6,
                          padding: 4,
                        }),
                      }}
                    />
                  )}
                />
                {errors.pharmacy && (
                  <span className="text-red-500">
                    {errors.pharmacy.message}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="mb-7">
            <label className="text-textPrimary font-nerisSemiBold">
              Search Pharmacy (Search by Zipcode or City)
            </label>
            <div className="mt-2">
              <input
                type="text"
                className="px-3 py-3 rounded-md border border-gray-200 bg-white w-full outline-0"
                placeholder="Search Pharmacy"
                onClick={() => setVisible(true)}
                {...register("name")}
              />
              {errors.pharmacy && (
                <span className="text-red-500">{errors.pharmacy.message}</span>
              )}
            </div>
          </div>
          {/* <div className="mb-7">
            <label className="text-textPrimary font-nerisSemiBold">
              Search Pharmacy
              <span className="text-textSecondary font-Poppins font-light">
                {" "}
                (Search by pharmacy name)
              </span>
            </label>
            <div className="mt-2">
              <Controller
                control={control}
                name="pharmacy"
                rules={{ required: "Pharmacy is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={pharmacyOptions}
                    placeholder="Search Pharmacy"
                    isClearable
                    onChange={(val) => {
                      field.onChange(val?.value ?? "");
                      setShowPharmacyDetails(false);
                      setShowSearchResults(false);
                    }}
                    value={
                      pharmacyOptions.find(
                        (opt) => opt.value === field.value
                      ) ?? null
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.pharmacy ? " " : "#E5E5E5",
                        borderRadius: 6,
                        padding: 4,
                      }),
                    }}
                  />
                )}
              />
              {errors.pharmacy && (
                <span className="text-red-500">{errors.pharmacy.message}</span>
              )}
            </div>
          </div> */}

          {isVisible && (
            <div>
              <div className="grid lg:grid-cols-2 gap-x-5 gap-y-7">
                {/* City select */}
                {/* <div>
                  <label className="text-textPrimary font-nerisSemiBold">
                    Search by City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search city"
                      className="px-4 py-2.5 rounded-md outline-0 border border-gray-200 w-full bg-white"
                      {...register("city", {
                        required: false,
                        minLength: {
                          value: 3,
                          message: "Character cannot be less then 3",
                        },
                      })}
                    />
                    {errors.city && (
                      <span className="text-red-500">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </div> */}

                {/* State select */}
                <div>
                  <label className="text-textPrimary font-nerisSemiBold">
                    Search by State Code
                  </label>
                  <div className="mt-2">
                    <Controller
                      control={control}
                      name="state"
                      rules={{ required: false }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={stateOptions}
                          placeholder="Select State"
                          isClearable
                          onChange={(val) => field.onChange(val?.value ?? "")}
                          value={
                            stateOptions.find(
                              (opt) => opt.value === field.value
                            ) ?? null
                          }
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: errors.state ? " " : "#E5E5E5",
                              borderRadius: 6,
                              padding: 4,
                            }),
                          }}
                        />
                      )}
                    />
                    {errors.state && (
                      <span className="text-red-500">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Zip select */}
                <div>
                  <label className="text-textPrimary font-nerisSemiBold">
                    Search by Zip Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search by zip code"
                      className="px-4 py-2.5 rounded-md outline-0 border border-gray-200 w-full bg-white"
                      {...register("zip", { required: false })}
                    />
                    {errors.zip && (
                      <span className="text-red-500">{errors.zip.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={searchPharmacies}
                  disabled={isLoading}
                  className="px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Searching..." : "Search Pharmacies"}
                </button>
              </div>
            </div>
          )}
          {/* Search Results */}
          {showSearchResults && pharmacyList?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                Search Results ({pharmacyList?.length} pharmacies found)
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {pharmacyList?.map((pharmacy, index) => (
                  <div
                    key={pharmacy.PharmacyId || index}
                    className="p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {pharmacy.StoreName || `Pharmacy ${index + 1}`}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Address:</span>{" "}
                            {pharmacy.Address1 || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {pharmacy.PrimaryPhone || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">City:</span>{" "}
                            {pharmacy.City || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">State:</span>{" "}
                            {pharmacy.State || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Zip:</span>{" "}
                            {pharmacy.ZipCode || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => handleSelectPharmacy(pharmacy)}
                          className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 text-sm font-medium"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {showSearchResults && pharmacyList.length === 0 && (
            <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No pharmacies found matching your search criteria.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search parameters.
              </p>
            </div>
          )}

          {/* Pharmacy Preview Section */}
          {showPharmacyDetails && selectedPharmacy && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Pharmacy Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p>{selectedPharmacy.StoreName || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Address:</p>
                  <p>{selectedPharmacy.Address1 || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">City:</p>
                  <p>{selectedPharmacy.City || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">State:</p>
                  <p>{selectedPharmacy.State || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Zip Code:</p>
                  <p>{selectedPharmacy.ZipCode || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Phone:</p>
                  <p>{selectedPharmacy.PrimaryPhone || "N/A"}</p>
                </div>
              </div>
              {!isConfirmed && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPharmacyDetails(false);
                      setSelectedPharmacy(null);
                      setValue("pharmacy", "");
                    }}
                    className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Choose Different Pharmacy
                  </button>
                </div>
              )}
            </div>
          )}

          {pharmacyValue && !showPharmacyDetails && !showSearchResults && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSelectPharmacyButton}
                className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90"
              >
                Show Pharmacy Details
              </button>
            </div>
          )}

          {changePharmacy && (
            <div className="pt-5 flex items-end justify-end">
              <button
                onSubmit={handleSubmit(onSubmit)}
                type="submit"
                className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-2 rounded-xl !w-[246px] hover:!outline hover:!outline-[#195B91]  transition-all duration-300"
              >
                {confirmPharmacy.isPending ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <> Save</>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
);

export default Setp3;
