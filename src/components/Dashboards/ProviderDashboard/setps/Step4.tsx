import { useMutation } from "@tanstack/react-query";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next"; // Added import
import { PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { MainContext } from "../../../../provider/ContextProvider";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

type Inputs = {
  newPrescriptionFees: string;
  refillPrescriptionFees: string;
  workEmail: string;
  primaryPhone: string;
  primaryFax: string;
  email: string;
};

const Step4 = forwardRef(
  (
    {
      onNext,
    }: {
      onNext: (data: Inputs) => void;
      setData: Dispatch<SetStateAction<Inputs>>;
    },
    ref
  ) => {
    const { t } = useTranslation("providerdashboard"); // Initialize t function
    const {
      register,
      handleSubmit,
      trigger,
      // reset,
      formState: { errors },
    } = useForm<Inputs>({
      mode: "onChange",
    });
    const { data: allData, setData } = useContext(MainContext);
    const navigator = useNavigate();
    // const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    const ProviderPaymentInfo = useMutation({
      mutationKey: ["clinician/profile"],
      mutationFn: (payload: Inputs) => PostData("/clinician/profile", payload),
      onSuccess: (data) => {
        console.log("pay data", data);
        // setData({ ...data });
        onNext();
        localStorage.setItem("is_profile_created", "true");
        // const data = {
        //   ...userInfo,
        //   is_profile_created: true,
        // };
        // localStorage.setItem("userInfo", JSON.stringify(data));
        navigator("/image-upload2");
      },
      onError: (err) => {
        console.log("err", err);
        toast.error(err?.response?.data?.message);
        // onNext();
      },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("Step 4 form data:", data);
      const combinedData = { ...allData, ...data };
      ProviderPaymentInfo.mutate(combinedData);
    };

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const result = await trigger();
        console.log("Validation result:", result);

        if (result) {
          handleSubmit(onSubmit)();
        }
        return result;
      },
    }));

    if (ProviderPaymentInfo.isPending) {
      return (
        <p className="h-96 w-full text-2xl font-semibold flex items-center justify-center gap-3">
          {t("submitting")} <Loader color="#000000" />
        </p>
      );
    }

    return (
      <div className="text-black">
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-center text-xl mb-5 font-semibold">
          {t("professionalfees")}
        </p>
        <form>
          <div className="grid lg:grid-cols-2 gap-x-5 gap-y-5">
            {/* Prescription Fees */}
            <div className="flex gap-2 items-start flex-col">
              <label className="font-semibold">
                {t("newprescriptionfees")}
              </label>
              <input
                {...register("newPrescriptionFees", {
                  required: t("newprescriptionfeesrequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("enterprescriptionfees")}
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.newPrescriptionFees && (
                <span className="text-red-500">
                  {t("newprescriptionfeesrequired")}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-start flex-col">
              <label className="font-semibold">
                {t("refillprescriptionfees")}
              </label>
              <input
                {...register("refillPrescriptionFees", {
                  required: t("refillprescriptionfeesrequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("enterprescriptionfees")}
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.refillPrescriptionFees && (
                <span className="text-red-500">
                  {t("refillprescriptionfeesrequired")}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-center text-xl pt-10 font-semibold">
              {t("communicationsettings")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 pt-5">
            {/* Prescription Fees */}
            <div className="flex gap-2 items-start flex-col">
              <label className="font-semibold">{t("workemail")}</label>
              <input
                {...register("email", { required: t("workemailrequired") })}
                placeholder="Enter Prescription Fees" // No specific JSON key; kept original
                type="email"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.email && (
                <span className="text-red-500">{t("workemailrequired")}</span>
              )}
            </div>
            <div className="flex gap-2 items-start flex-col">
              <label className="font-semibold">{t("faxnumber")}</label>
              <input
                {...register("primaryFax", {
                  required: true,
                  minLength: {
                    value: 10,
                    message: "Primary Phone must be 10 digits", // No JSON key; kept original
                  },
                })}
                placeholder="Enter Prescription Fees" // No specific JSON key; kept original
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.primaryFax && (
                <span className="text-red-500">
                  {errors?.primaryFax?.message}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-start flex-col">
              <label className="font-semibold">{t("primarynumber")}</label>
              <input
                {...register("primaryPhone", {
                  required: true,
                  minLength: {
                    value: 10,
                    message: "Primary phone must be 10 digits", // No JSON key; kept original
                  },
                })}
                placeholder="Enter Prescription Fees" // No specific JSON key; kept original
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.primaryPhone && (
                <span className="text-red-500">
                  {errors?.primaryPhone?.message}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default Step4;
