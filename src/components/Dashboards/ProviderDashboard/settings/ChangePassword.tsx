import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Inputs = {
  newPassword: string;
  currentPassword: string;
  repassword?: string;
};

const ChangePassword = () => {
  const { t } = useTranslation("providerdashboard");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    rePassword: false,
  });

  const UpdatePassword = useMutation({
    mutationKey: ["update-password"],
    mutationFn: (payload) => PostData("auth/change-password", payload, "put"),
    onSuccess: () => {
      toast.success(t("password_update_successful"));
      reset();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const updateData = {
      newPassword: data?.newPassword,
      currentPassword: data?.currentPassword,
    };
    UpdatePassword.mutate(updateData);
  };

  return (
    <div>
      <p className="lg:text-3xl text-2xl font-nerisSemiBold text-textPrimary">
        {t("change_password")}
      </p>
      <div className="bg-white rounded-2xl p-6 mt-10">
        {/* <p className="font-nerisSemiBold text-2xl">Change Password</p> */}
        <Toaster />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-x-5 gap-y-3 mt-5"
        >
          <div className=" flex gap-2 items-start flex-col ">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("current_password")}
            </label>
            <div className="w-full relative">
              <input
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                placeholder={t("enter_old_password")}
                type={!showPassword?.currentPassword ? "password" : "text"}
                {...register("currentPassword", {
                  required: t("old_password_is_required"),
                  minLength: {
                    value: 8,
                    message: t("old_password_must_be_at_least_8_characters"),
                  },
                })}
              />
              {/* <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    currentPassword: !showPassword.currentPassword,
                  }))
                }
              >
                {!showPassword.currentPassword ? (
                  <EyeOutlined className="!text-gray-500" />
                ) : (
                  <EyeOutlined className="!text-gray-200" />
                )}
              </button> */}
            </div>
            {errors.currentPassword && (
              <span className="text-red-500">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div className=" flex gap-2 items-start flex-col ">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("new_password")}
            </label>
            <div className="w-full relative">
              <input
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                placeholder={t("enter_new_password")}
                type={!showPassword?.newPassword ? "password" : "text"}
                {...register("newPassword", {
                  required: t("new_password_is_required"),
                  minLength: {
                    value: 8,
                    message: t("new_password_must_be_at_least_8_characters"),
                  },
                })}
              />
              {/* <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    newPassword: !showPassword.newPassword,
                  }))
                }
              >
                {!showPassword.currentPassword ? (
                  <EyeOutlined className="text-gray-200" />
                ) : (
                  <EyeOutlined className="text-gray-200" />
                )}
              </button> */}
            </div>

            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>

          <div className=" flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("confirm_password")}
            </label>
            <div className="w-full relative">
              <input
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                placeholder={t("confirm_password")}
                type={!showPassword?.rePassword ? "password" : "text"}
                {...register("repassword", {
                  required: t("confirm_password_is_required"),
                  validate: (value) =>
                    value === watch("newPassword") || t("passwords_do_not_match"),
                })}
              />
              {/* <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    rePassword: !showPassword.rePassword,
                  }))
                }
              >
                {!showPassword.currentPassword ? (
                  <EyeOutlined className="text-gray-200" />
                ) : (
                  <EyeOutlined className="text-gray-200" />
                )}
              </button> */}
            </div>
            {errors.repassword && (
              <span className="text-red-500">{errors.repassword.message}</span>
            )}
          </div>

          <Button
            htmlType="submit"
            className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 md:!col-span-2 !w-fit !mx-auto !px-10 !mt-8"
          >
            {UpdatePassword?.isPending ? <Loader /> : <> {t("save_changes")}</>}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;