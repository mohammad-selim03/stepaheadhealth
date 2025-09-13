import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next"; // Added import
import { MainContext } from "../../../../provider/ContextProvider";
import { City, State } from "country-state-city";
import Select from "react-select";

type Inputs = {
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  country: string;
  primaryFax: string;
  primaryPhone: string;
};

const Step2 = forwardRef(
  (
    {
      onNext,
      doesData,
    }: {
      onNext: (data: Inputs) => void;
    },
    ref
  ) => {
    const { t } = useTranslation("providerdashboard"); // Initialize t function
    const {
      register,
      handleSubmit,
      control,
      setValue,
      reset,
      watch,
      formState: { errors },
    } = useForm<Inputs>({
      defaultValues: {
        address1:
          doesData?.addresses?.[0]?.address_purpose == "MAILING"
            ? doesData?.addresses?.[0]?.address_1
            : doesData?.addresses?.[1]?.address_1 || "",
        zipCode: doesData?.addresses?.[1]?.postal_code || "0",
        state: doesData?.addresses?.[1]?.state || "",
        city: doesData?.addresses?.[1]?.city || "",
        country: "United States",
      },
    });
    const [selectedState, setSelectedState] = useState("");
    const [cityOptions, setCityOptions] = useState([]);
    const [zipOptions, setZipOptions] = useState([]); // optional, if you add zip data

    useEffect(() => {
      if (selectedState) {
        const cities = City.getCitiesOfState("US", selectedState);
        setCityOptions(
          cities.map((city) => ({ label: city.name, value: city.name }))
        );
      } else {
        setCityOptions([]);
      }
    }, [selectedState]);

    const { setData } = useContext(MainContext);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("Step 2 form data:", data);
      setData((prev) => ({ ...prev, ...data }));
      onNext(data);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));
    const US_STATE_COUNTRY_CODE = "US";
    // Memoize to prevent recomputation
    const stateOptions = useMemo(() => {
      return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
    }, []);

    useEffect(() => {
      if (selectedState) {
        const cities = City.getCitiesOfState(
          US_STATE_COUNTRY_CODE,
          selectedState
        );
        setCityOptions(
          cities &&
            cities?.map((city) => ({
              label: city.name,
              value: city.name,
            }))
        );
      } else {
        setCityOptions([]);
        setZipOptions([]);
      }
    }, [selectedState]);

    const customStyles = {
      control: (base) => ({
        ...base,
        paddingTop: 5,
        paddingBottom: 5,
        border: "1px solid #E5E5E5",
      }),
    };

    useEffect(() => {
      if (doesData) {
        reset({
          address1:
            doesData?.addresses?.[0]?.address_purpose == "MAILING"
              ? doesData?.addresses?.[0]?.address_1
              : doesData?.addresses?.[1]?.address_1 || "",
          zipCode: doesData?.addresses?.[1]?.postal_code || "0",
          state: doesData?.addresses?.[1]?.state || "",
          city: doesData?.addresses?.[1]?.city || "",
          country: "United States",
        });
      }
    }, [doesData, reset]);

    return (
      <div>
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          {t("confirmaddress")}
        </p>
        <form className="grid lg:grid-cols-2 gap-x-5 gap-y-1">
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("address1")}
            </label>
            <input
              {...register("address1", { required: t("addressrequired") })}
              placeholder={t("enteraddress")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.address1 && (
              <span className="text-red-500">{t("addressrequired")}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("address2")}
            </label>
            <input
              {...register("address2", { required: false })}
              placeholder={t("enteraddress2")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("state")}
            </label>
            <Controller
              name="state"
              control={control}
              rules={{
                required: t("staterequired"),
              }}
              render={({ field }) => (
                <div style={{ width: "100%" }}>
                  <Select
                    options={stateOptions}
                    value={stateOptions.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || "";
                      setSelectedState(value);
                      field.onChange(value);
                      setValue("city", "");
                      setValue("zipCode", "");
                    }}
                    styles={customStyles}
                    placeholder={t("selectstate")}
                    isClearable
                    isSearchable
                  />
                </div>
              )}
            />
            {errors.state && (
              <span className="text-red-500">{errors.state.message}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("city")}
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: t("cityrequired") }}
              render={({ field }) => (
                <Select
                  options={cityOptions}
                  value={cityOptions.find((opt) => opt.value === field.value)}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value || "")
                  }
                  styles={customStyles}
                  placeholder={t("selectcity")}
                  className="w-full !bg-white"
                  isClearable
                  isDisabled={!selectedState}
                />
              )}
            />

            {errors.city && (
              <span className="text-red-500">{errors.city.message}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("postalcode")}
            </label>
            <input
              {...register("zipCode", {
                required: t("postalcoderequired"),
              })}
              placeholder={t("enterpostalcode")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.zipCode && (
              <span className="text-red-500">{errors.zipCode.message}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("country")}
            </label>
            <input
              {...register("country", { required: t("countryrequired") })}
              placeholder={t("entercountry")}
              type="text"
              value={"United States"}
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.country && (
              <span className="text-red-500">{t("countryrequired")}</span>
            )}
          </div>
        </form>
      </div>
    );
  }
);

export default Step2;
