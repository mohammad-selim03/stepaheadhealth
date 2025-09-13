import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { cvsLocations } from "../../../../lib/StaticData";
import { imageProvider } from "../../../../lib/imageProvider";
import {
  Call1Svg,
  Location1Svg,
  TelePhoneSvg,
} from "../../../../assets/svgContainer";

import { Button } from "antd";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { MainContext } from "../../../../provider/ContextProvider";
import { State } from "country-state-city";

type Inputs = {
  pharmacy: string;
  city: string;
  state: string;
  state1: string;
  zip: string;
  filterBySpecialty: boolean;
};

type PharmacyOption = {
  value: string;
  label: string;
  state: string;
  city: string;
  zip: string;
};
type pharDatatype = {
  storeName: string;
  address1: string;
  primaryPhone: string;
  zipCode: string;
  state: string;
  city: string;
};

const pharmacyOptions: PharmacyOption[] = [
  {
    value: "pharmacy-001",
    label: "Pharmacy One",
    state: "CA",
    city: "Los Angeles",
    zip: "90001",
  },
  {
    value: "pharmacy-002",
    label: "Pharmacy Two",
    state: "CA",
    city: "San Francisco",
    zip: "94101",
  },
  {
    value: "pharmacy-003",
    label: "Pharmacy Three",
    state: "NY",
    city: "New York",
    zip: "10001",
  },
  {
    value: "pharmacy-004",
    label: "Pharmacy Four",
    state: "TX",
    city: "Houston",
    zip: "77001",
  },
  {
    value: "pharmacy-005",
    label: "Pharmacy Five",
    state: "TX",
    city: "Austin",
    zip: "73301",
  },
  {
    value: "pharmacy-006",
    label: "Pharmacy Six",
    state: "FL",
    city: "Miami",
    zip: "33101",
  },
];

interface Setp1Props {
  onNext?: (data: Inputs) => void;
}

interface Step1Ref {
  submit: () => void;
}

const Setp1 = forwardRef<Step1Ref, Setp1Props>(({ onNext }, ref) => {
  const [visibleDiv, setVisibleDiv] = useState<"one" | "two" | "three">("one");
  const [formData, setFormData] = useState<Inputs | null>(null);

  const { data, isLoading, error } = useQuery<pharDatatype>({
    queryKey: ["get-pharmacy"],
    queryFn: () => GetData("pharmacy"),
  });

  const { setData } = useContext(MainContext);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      pharmacy: "",
      city: "",
      state: "",
      zip: "",
      filterBySpecialty: false,
    },
  });
  const US_STATE_COUNTRY_CODE = "US";
  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Form Data", data);
    setFormData(data);
    // setVisibleDiv("three");
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  const handleSelectPharmacy = () => {
    if (formData) {
      onNext?.(formData);
    }
  };

  const hanldeNextStep = () => {
    if (data) {
      onNext?.(data);
      setData(data);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 pb-10">
      {visibleDiv === "one" &&
        (isLoading ? (
          <p className="flex items-center justify-center h-80">
            <Loader color="#000000" />
          </p>
        ) : error ? (
          <p className="text-center h-40">Pharmacy not found.!</p>
        ) : (
          <div>
            <p className="font-nerisSemiBold lg:text-2xl md:text-xl text-base  text-textPrimary pb-5">
              Select Pharmacy
            </p>

            <div className="w-fit sm:h-[403px] mt-5">
              <img
                className="w-full h-[254px] rounded-t-xl"
                src={imageProvider.MedicineImage}
                alt="Pharmacy"
              />

              <div className="bg-[#F2F8FF] px-5 2xl:px-2 3xl:px-5 4xl:px-5 py-6 rounded-b-xl">
                <p className="font-nerisSemiBold text-textPrimary">
                  {data?.storeName}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center mt-2">
                  <div className="flex gap-1 items-center sm:border-r sm:pr-2">
                    <Location1Svg />
                    <p className="text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.address1}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center sm:border-r sm:px-2">
                    <Call1Svg />
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.primaryPhone}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center sm:border-r sm:px-2">
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.zipCode}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center sm:border-r sm:px-2">
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.state}
                    </p>
                  </div>

                  <div className="flex gap-1 items-center sm:border-r sm:px-2">
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.city}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                  <Link to={""}>
                    <Button
                      onClick={() => hanldeNextStep()}
                      className="!bg-primaryColor w-full md:!h-10 !h-8 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300"
                    >
                      Select & Proceed
                    </Button>
                  </Link>
                  <Link to={"/pharmacy"}>
                    <Button className="!bg-white md:!h-10 !h-8 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor hover:!text-white hover:!scale-105 !transition-all !duration-300">
                      Change Pharmacy
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      {visibleDiv === "two" && (
        <div>
          <div className="p-6 bg-[#F2F8FF] rounded-xl">
            <p className="text-textPrimary font-nerisSemiBold lg:text-3xl md:text-2xl text-xl">
              Change Pharmacy
            </p>
            <form
              className="grid 2xl:grid-cols-2 gap-5 mt-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Pharmacy Select */}
              <div>
                <label className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                  Search by Pharmacy Name
                </label>
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
                      onChange={(val) => field.onChange(val?.value ?? "")}
                      value={
                        pharmacyOptions.find(
                          (opt) => opt.value === field.value
                        ) ?? null
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.pharmacy ? "" : "#E5E5E5",
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

              <div>
                <label className="text-textPrimary font-nerisSemiBold">
                  Search by City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search city"
                    className="px-4 py-2.5 rounded-md outline-0 border border-gray-200 w-full bg-white"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && (
                    <span className="text-red-500">{errors.city.message}</span>
                  )}
                </div>
              </div>

              {/* State select */}
              <div>
                <label className="text-textPrimary font-nerisSemiBold">
                  Search by State Code
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name="state"
                    rules={{ required: "State is required" }}
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
                    <span className="text-red-500">{errors.state.message}</span>
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
                    {...register("zip", { required: "Zip Code is required" })}
                  />
                  {errors.zip && (
                    <span className="text-red-500">{errors.zip.message}</span>
                  )}
                </div>
              </div>

              {/* Filter Checkbox */}
              <div className="2xl:col-span-2 flex justify-end items-center gap-3">
                <Controller
                  control={control}
                  name="filterBySpecialty"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="w-4 h-4"
                    />
                  )}
                />
                <label className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                  Filter By Specialty
                </label>
              </div>

              {/* Conditional Specialty State */}
              {watch("filterBySpecialty") && (
                <div>
                  <label className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                    Specialty State Code
                  </label>
                  <Controller
                    control={control}
                    name="state1"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={stateOptions}
                        placeholder="Select State"
                        isClearable
                        onChange={(val) => field.onChange(val?.value ?? "")}
                        value={
                          field.value
                            ? { value: field.value, label: field.value }
                            : null
                        }
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: errors.state1 ? "" : "#E5E5E5",
                            borderRadius: 6,
                            padding: 4,
                          }),
                        }}
                      />
                    )}
                  />
                </div>
              )}

              <Button
                htmlType="submit"
                className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5  hover:!bg-white hover:!outline hover:!outline-primaryColor hover:!text-primaryColor transition-all duration-300 2xl:col-span-2 mx-auto "
              >
                Search Pharmacy
              </Button>
            </form>
          </div>
        </div>
      )}
      {visibleDiv === "three" && (
        <div>
          <div className="bg-white my-5 rounded-xl">
            <div className="flex items-start justify-between gap-10">
              <p className="font-nerisSemiBold 2xl:text-2xl xl:text-base md:text-xl text-base  text-textPrimary">
                Great! We've Found 20 Pharmacies Near You
              </p>
              <div className="flex gap-1 items-center">
                <p className="font-nerisSemiBold text-textPrimary text-nowrap text-sm sm:text-base">
                  Filter By:
                </p>
                <div>
                  {" "}
                  <input
                    type="checkbox"
                    className=" accent-primaryColor"
                  />{" "}
                </div>
                <p className="font-Poppins font-light text-textPrimary text-sm sm:text-base">
                  {" "}
                  ESPC
                </p>
              </div>
            </div>

            <div className="grid 2xl:grid-cols-2 4xl:grid-cols-3 gap-x-5 gap-y-10">
              {cvsLocations.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:h-[403px] mt-5 relative"
                >
                  <img
                    className="w-full h-[254px] rounded-t-xl"
                    src={imageProvider.MedicineImage}
                    alt="Pharmacy"
                  />
                  <div className=" absolute top-4 left-4 flex gap-2 items-center ">
                    <p className="text-white font-nerisSemiBold">
                      Supported Types:
                    </p>
                    <div className="text-[#191919] bg-[#55C9EA] px-2 py-1 font-nerisBlack text-[10px] rounded-lg">
                      EPCS
                    </div>
                  </div>

                  <div className="bg-[#F2F8FF] px-5 2xl:px-2 3xl:px-5 4xl:px-5 py-6 rounded-b-xl">
                    <p className="font-nerisSemiBold text-textPrimary">
                      {item.name}
                    </p>
                    <p className="mt-2">{item.des}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center mt-2">
                      <div className="flex gap-1 items-center sm:border-r sm:pr-2">
                        <Location1Svg />
                        <p className="text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                          {item.location}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center sm:border-r sm:px-2">
                        <Call1Svg />
                        <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                          {item.phone}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center sm:px-2">
                        <TelePhoneSvg />
                        <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                          Fax: {item.fax}
                        </p>
                      </div>
                    </div>

                    {/* Button */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                      <Link to="">
                        <Button
                          onClick={handleSelectPharmacy}
                          className="!bg-primaryColor w-full md:!h-10 !h-8 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300"
                        >
                          Select Pharmacy
                        </Button>
                      </Link>
                      <Button className="!bg-white md:!h-10 !h-8 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor hover:!text-white hover:!scale-105 !transition-all !duration-300">
                        See on Google Map
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Setp1.displayName = "Setp1";

export default Setp1;
