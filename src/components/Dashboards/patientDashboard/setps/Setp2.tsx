import { City, State } from "country-state-city";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { MainContext } from "../../../../provider/ContextProvider";
import { useTranslation } from "react-i18next";

type Inputs = {
  weight: string;
  height: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  country: string;
};

const Setp2 = forwardRef(
  ({ onNext }: { onNext: (data: Inputs) => void }, ref) => {
    const { data, setData } = useContext(MainContext);

    const { t } = useTranslation("patientprofilecreation");
    const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      localStorage.setItem("state", JSON.stringify(data?.state));
      setData((prev) => ({ ...prev, ...data }));
      onNext(data);
      // console.log("dddd", data)
      const info = {
        city: data?.city,
        state: data?.state,
        zipCode: data?.zipCode,
      };
      localStorage.setItem("info", JSON.stringify(info));
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

    const [selectedState, setSelectedState] = useState("");
    const [cityOptions, setCityOptions] = useState([]);
    const [zipOptions, setZipOptions] = useState([]); // optional, if you add zip data

    useEffect(() => {
      if (selectedState) {
        const cities = City.getCitiesOfState(
          US_STATE_COUNTRY_CODE,
          selectedState
        );
        setCityOptions(
          cities?.map((city) => ({
            label: city?.name,
            value: city?.name,
          }))
        );

        // If you have ZIP data:
        // setZipOptions(lookupZipsByState(selectedState));
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
    // Initialize form with context data
    useEffect(() => {
      const initialValues = {
        weight: data?.weight || "",
        height: data?.height || "",
        address1: data?.address1 || "",
        address2: data?.address2 || "",
        state: data?.state || "",
        city: data?.city || "",
        zipCode: data?.zipCode || "",
        country: data?.country || "US", // Default to US
      };
      reset(initialValues);
      if (initialValues.state) {
        setSelectedState(initialValues.state);
      }
    }, [data, reset]);

    return (
      <div className="">
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          {t("letsGetStarted")}
        </p>
        <form className="grid lg:grid-cols-2 gap-x-5 gap-y-1">
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("weight")}
            </label>
            <input
              {...register("weight", {
                required: true,
                valueAsNumber: true,
                minLength: {
                  value: 1,
                  message: t("weightMin"),
                },
                maxLength: {
                  value: 1000,
                  message: t("weightMax"),
                },
              })}
              placeholder={t("enterWeight")}
              type="number"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.weight && (
              <span className="text-red-500"> {t("weightRequired")}</span>
            )}
          </div>
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("height")}
            </label>
            <input
              {...register("height", {
                required: true,
                valueAsNumber: true,
                minLength: {
                  value: 1,
                  message: t("heightMin"),
                },
                maxLength: {
                  value: 120,
                  message: t("heightMax"),
                },
              })}
              placeholder={t("enterHeight")}
              type="number"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.height && (
              <span className="text-red-500"> {t("heightRequired")}</span>
            )}
          </div>
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("address1")}
            </label>
            <input
              {...register("address1", { required: true })}
              placeholder={t("enterAddress")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.address1 && (
              <span className="text-red-500"> {t("addressRequired")}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("address2")}
            </label>
            <input
              {...register("address2", { required: false })}
              placeholder={t("enterAddress2")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.address2 && (
              <span className="text-red-500"> {t("addressRequired")}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("state")}
            </label>
            <Controller
              name="state"
              control={control}
              rules={{
                required: t("stateRequired"),
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
                    placeholder={t("selectState")}
                    isClearable
                    isSearchable
                  />
                </div>
              )}
            />
            {errors.state && (
              <span className="text-red-500">{t("stateRequired")}</span>
            )}
          </div>
 
          {/* city selector */}
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("city")}
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: t("cityRequired") }}
              render={({ field }) => (
                <Select
                  options={cityOptions}
                  value={cityOptions.find((opt) => opt.value === field.value)}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value || "")
                  }
                  styles={customStyles}
                  placeholder={t("selectCity")}
                  className="w-full !bg-white"
                  isClearable
                  isDisabled={!selectedState}
                />
              )}
            />
            {errors.city && (
              <span className="text-red-500">{t("cityRequired")}</span>
            )}
          </div>
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("postalCode")}
            </label>
            <input
              {...register("zipCode", {
                required: true,
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: t("invalidZip"),
                },
              })}
              placeholder={t("enterPostalCode")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.zipCode && (
              <span className="text-red-500">{errors?.zipCode?.message}</span>
            )}
          </div>

          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              Country
            </label>
            <input
              {...register("country", { required: true })}
              placeholder="Enter Country"
              type="text"
              value={"United States"}
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.country && (
              <span className="text-red-500">Country is required</span>
            )}
          </div>
        </form>
      </div>
    );
  }
);

export default Setp2;
