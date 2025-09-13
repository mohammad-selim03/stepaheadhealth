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
import Select from "react-select";
import { State } from "country-state-city";
import { MainContext } from "../../../../provider/ContextProvider";

type Inputs = {
  npiNumber: string;
  licenseNumber: string;
  desc: string;
  state: string;
  stateLicenseNo: string;
};

const Step3 = forwardRef(
  ({ onNext, doesData }: { onNext: (data: Inputs) => void }, ref) => {
    const { t } = useTranslation("providerdashboard"); // Initialize t function
    const [selectedState, setSelectedState] = useState("");

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
    } = useForm<Inputs>({
      defaultValues: {
        state:
          doesData?.taxonomies?.find((taxo) => taxo.primary === true)?.state ||
          "",
        licenseNumber:
          doesData?.taxonomies?.find((taxo) => taxo.primary === true)
            ?.license || "",
        desc:
          doesData?.taxonomies?.find((taxo) => taxo.primary === true)?.desc ||
          "",
        npiNumber: doesData?.number || userInfo?.npiId || "",
      },
    });

    // get npiID
    // const userInfo: { npiId: number } = (() => {
    //   try {
    //     return JSON.parse(localStorage.getItem("userInfo") || "null");
    //   } catch (error) {
    //     return undefined;
    //   }
    // })();

    const npiID = userInfo.npiId || "N/A";
    const { setData } = useContext(MainContext);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("dataaa", data);

      const medicalLicenseNumbers = [
        {
          licenseNumber: data?.licenseNumber,
          state: data?.state,
          primary: true,
          desc: data?.desc,
        },
      ];
      setData((prev) => ({ ...prev, npiNumber: npiID, medicalLicenseNumbers }));
      onNext();
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

    const customStyles = {
      control: (base: any) => ({
        ...base,
        paddingTop: 5,
        paddingBottom: 5,
        border: "1px solid #E5E5E5",
      }),
    };
    useEffect(() => {
      if (doesData) {
        const primaryTaxonomy = doesData?.taxonomies?.find(
          (taxo) => taxo.primary === true
        );
        reset({
          state: primaryTaxonomy?.state || "",
          licenseNumber: primaryTaxonomy?.license || "",
          desc: primaryTaxonomy?.desc || "",
          npiNumber: doesData?.number || "",
        });
      }
    }, [doesData, reset]);

    return (
      <div>
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          {t("licenseinformation")}
        </p>
        <form className="grid grid-cols-1">
          <div className="grid lg:grid-cols-2 gap-x-5 gap-y-5">
            <div className="flex gap-2 flex-col mt-6">
              <label className="text-textPrimary font-nerisSemiBold">{t("npi")}</label>
              <input
                {...register("npiNumber", { required: t("npirequired") })}
                placeholder={t("enternpi")}
                type="text"
                // value={npiID}
                // readOnly
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors?.npiNumber && (
                <span className="text-red-500">{t("npirequired")}</span>
              )}
            </div>
            {/* License No */}
          </div>
          <div className="text-black pt-5 ">
            <p className="text-4xl font-semibold">{t("primarylicensestates")}</p>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start flex-col">
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
              <div className="flex flex-col items-start gap-2">
                <label className="font-semibold">{t("licenseno")}</label>
                <input
                  {...register("licenseNumber", { required: t("licensenorequired") })}
                  placeholder={t("enterlicenseno")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.licenseNumber && (
                  <span className="text-red-500">{t("licensenorequired")}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <label className="font-semibold">{t("description")}</label>
              <textarea
                {...register("desc", { required: t("descriptionrequired") })}
                placeholder={t("enterdescription")}
                className="text-textSecondary resize-none h-20 font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.desc && (
                <span className="text-red-500">{t("descriptionrequired")}</span>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default Step3;