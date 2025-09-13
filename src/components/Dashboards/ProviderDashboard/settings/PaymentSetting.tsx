import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const PaymentSetting = () => {
  const { t } = useTranslation("providerdashboard");
  const connectStripe = useMutation({
    mutationKey: ["connectStripe"],
    mutationFn: () => PostData("payment/clinician/onboard"),
    onSuccess: (data) => {
      window.location.replace(data?.data?.url);
    },
    onError: (err) => {
      toast.error(err?.reponse?.data?.message || t("failed_to_connect_stripe"));
    },
  });

  const handleConnect = () => {
    connectStripe.mutate();
  };
  const queryClient = useQueryClient();
  const { data: fees, isLoading } = useQuery({
    queryKey: ["fees"],
    queryFn: () => GetData("payment/clinician/fees"),
  });

  const updateFees = useMutation({
    mutationKey: ["update-fees"],
    mutationFn: (payload) => PostData("payment/clinician/fees", payload),
    onSuccess: () => {
      toast.success(t("fees_updated"));
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t("fees_update_failed"));
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPrescriptionFees: fees?.newPrescriptionFees,
      refillPrescriptionFees: fees?.refillPrescriptionFees,
    },
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const { data } = useQuery({
    queryKey: ["status-stripe"],
    queryFn: () => GetData(`payment/clinician/${userInfo?.id}/account-status`),
    enabled: true,
  });
  // console.log("da", data);

  const onSubmit = (data) => {
    updateFees.mutate(data);
  };

  useEffect(() => {
    reset({
      newPrescriptionFees: fees?.newPrescriptionFees,
      refillPrescriptionFees: fees?.refillPrescriptionFees,
    });
  }, [fees, reset]);

  return (
    <div>
      <p className="font-nerisSemiBold lg:text-3xl text-2xl text-textPrimary mb-10">
        {t("payment_settings")}
      </p>

      {/* ======== PayPal Email Form ======== */}
      <div className="bg-white rounded-2xl p-6">
        <Toaster />
        {isLoading ? (
          <p className="flex items-center justify-center h-screen">
            <Loader color="#000000" />
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("new_prescription_fees_in_usd")}
              </label>
              <input
                {...register("newPrescriptionFees", { required: true })}
                placeholder={t("enter_fee")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors?.newPrescriptionFees && (
                <span className="text-red-500">
                  {t("new_prescription_fee_is_required")}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("refill_prescription_fees_in_usd")}
              </label>
              <input
                {...register("refillPrescriptionFees", { required: true })}
                placeholder={t("enter_fee")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors?.refillPrescriptionFees && (
                <span className="text-red-500">
                  {t("refill_prescription_fee_is_required")}
                </span>
              )}
            </div>

            <div className="flex justify-end col-span-2">
              <Button
                htmlType="submit"
                className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 !col-span-2 !px-10 !mt-8"
              >
                {updateFees?.isPending ? <Loader /> : <> {t("save_changes")}</>}
              </Button>
            </div>
          </form>
        )}
        <div className="py-10 flex items-center justify-center">
          {data?.capabilities?.card_payments !== "inactive" ? (
            <p className="text-white bg-[#6461FC] px-5 py-2 rounded-md cursor-pointer hover:scale-110 transition-all duration-300">
              {t("connected_to_the_stripe_account")}
            </p>
          ) : (
            <button
              onClick={handleConnect}
              className="text-white bg-[#6461FC] px-5 py-2 rounded-md cursor-pointer hover:scale-110 transition-all duration-300"
            >
              {connectStripe?.isPending ? (
                <Loader />
              ) : (
                <p>+ {t("connect_your_stripe_account")}</p>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ======== Charges Form ========
      <p className="font-nerisSemiBold lg:text-[32px] text-2xl text-textPrimary my-10">
        Consulting Charges Settings
      </p>

      {isLoading ? (
        <p className="h-80 flex items-center justify-center">
          <Loader color="#000000" />
        </p>
      ) : (
        <div className="bg-white rounded-2xl p-6">
          <form
            onSubmit={handleSubmitCharges(onSubmitCharges)}
            className="grid md:grid-cols-2 gap-x-5 gap-y-5"
          >
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Prescription Fees ( In USD )
              </label>
              <input
                {...registerCharges("newPrescriptionFees", {
                  required: true,
                  valueAsNumber: true,
                })}
                placeholder="Enter Prescription Fees"
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {chargesErrors.newPrescriptionFees && (
                <span className="text-red-500">
                  Prescription Fees is required
                </span>
              )}
            </div>

            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Consultation Fees ( In USD )
              </label>
              <input
                {...registerCharges("refillPrescriptionFees", {
                  required: true,
                  valueAsNumber: true,
                })}
                placeholder="Enter Consultation Fees"
                type="number"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {chargesErrors.refillPrescriptionFees && (
                <span className="text-red-500">
                  Consultation Fees is required
                </span>
              )}
            </div>

            <div className="flex justify-end md:col-span-2">
              <Button
                htmlType="submit"
                className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 !col-span-2 !px-10 !mt-8"
              >
                {SaveInfo.isPending ? <Loader /> : <p> Save Changes</p>}
              </Button>
            </div>
          </form>
        </div>
      )} */}
    </div>
  );
};

export default PaymentSetting;
