import { Link, useNavigate } from "react-router";
import { CallbtnSvg, LocationSvg, MailtoSvg } from "../../assets/svgContainer";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
import { Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "../../api/API";
import Loader from "../../components/common/Loader";
type Inputs = {
  password: string;
  repassword: string;
};
const NewPassword = () => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);

  const triggerLoaderThenModal = () => {
    return new Promise<void>((resolve) => {
      setSpinning(true);
      let ptg = -10;

      const interval = setInterval(() => {
        ptg += 5;
        setPercent(ptg);

        if (ptg > 120) {
          clearInterval(interval);
          setSpinning(false);
          setPercent(0);
          resolve();
        }
      }, 100);
    }).then(() => {
      showModal();
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const ResetPassword = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (payload: { newPassword: string }) =>
      PostData(`/auth/reset-password/${reset_token}`, payload, "put"),
    onSuccess: () => {
      triggerLoaderThenModal();
      localStorage.removeItem("resetToken");
    },
  });

  // get reset token
  const reset_token: string | undefined = (() => {
    try {
      return JSON.parse(localStorage.getItem("resetToken") || "null");
    } catch {
      return undefined;
    }
  })();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const combinedData = {
      newPassword: data?.password,
    };
    ResetPassword.mutate(combinedData);
  };

  return (
    <div className="lg:my-[50px] my-10">
      <Container>
        <div className="3xl:flex-row 3xl:gap-5 items-center flex flex-col gap-10 ">
          <div className="w-full order-2 3xl:order-1">
            <div className="lg:flex gap-5 items-center justify-center space-y-5 lg:space-y-0">
              <div className=" overflow-hidden rounded-md">
                <img
                  className="lg:h-[338px] object-cover rounded-md hover:scale-105 duration-300"
                  src={imageProvider.authorImg1}
                  alt="image"
                />
              </div>
              <div className=" overflow-hidden rounded-md">
                <img
                  className="lg:h-[338px]  object-cover  rounded-md hover:scale-105 duration-300"
                  src={imageProvider.authorImg2}
                  alt="image"
                />
              </div>
            </div>

            <div className="bg-primaryColor rounded-lg px-6 py-6 mt-5">
              <p className="text-white font-nerisBlack text-2xl text-center">
                StepAhead Health
              </p>
              <div className="lg:flex justify-between gap-6">
                <div className="bg-white rounded-md p-6 mt-6  h-[174px] w-full">
                  <div className="bg-primaryColor rounded-full text-center p-3 w-[48px] h-[48px] mx-auto">
                    <LocationSvg />
                  </div>
                  <p className="text-base font-Poppins font-light mt-2 text-center">
                    Contact
                  </p>
                  <p className="text-[#333333] text-base font-nerisSemiBold  mt-2 text-center cursor-pointer text-nowrap">
                    +1-(678)-820-2221
                  </p>
                </div>

                <div className="bg-white rounded-md p-6 mt-6  h-[174px] w-full ">
                  <div className="bg-primaryColor rounded-full text-center p-3 w-[48px] h-[48px] mx-auto">
                    <CallbtnSvg />
                  </div>
                  <p className="text-base font-Poppins font-light mt-2 text-center">
                    Toll Free Number
                  </p>
                  <p className="text-[#333333] text-base font-nerisSemiBold  mt-2 text-center cursor-pointer text-nowrap">
                    +1-(855)-725-7629
                  </p>
                </div>

                <div className="bg-white rounded-md p-6 mt-6  h-[174px] w-full ">
                  <div className="bg-primaryColor rounded-full text-center p-3 w-[48px] h-[48px] mx-auto">
                    <MailtoSvg />
                  </div>
                  <p className="text-base font-Poppins font-light mt-2 text-center">
                    Email
                  </p>
                  <p className="text-[#333333] text-base font-nerisSemiBold  mt-2 text-center cursor-pointer ">
                    support@stepaheadheal <br />
                    th.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white outline outline-primaryColor rounded-md p-6  3xl:h-[635px] w-full order-1 3xl:order-2">
            <p className="lg:text-[32px] text-2xl font-nerisSemiBold text-[#191919] 3xl:mt-25">
              Create new password
            </p>
            <p className="text-base font-light font-Poppins text-[#5A5C5F] mt-4">
              Your new password must be unique from those previously used.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  New Password
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder="Password"
                  type="password"
                  {...register("password", {
                    required: " New Password is required",
                    minLength: {
                      value: 8,
                      message: " New Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className=" flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  Confirm Password
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder="Password"
                  type="password"
                  {...register("repassword", {
                    required: " Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.repassword && (
                  <span className="text-red-500">
                    {errors.repassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="text-white font-nerisSemiBold bg-primaryColor text-center w-full py-3 rounded-md mt-6 cursor-pointer hover:scale-101 duration-300"
              >
                {ResetPassword.isPending ? (
                  <p>
                    <Loader />
                  </p>
                ) : (
                  "Verify"
                )}
              </button>
              <div>
                <Modal
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                  centered
                >
                  <div className="w-fit mx-auto flex flex-col items-center">
                    <img className="my-5" src={imageProvider.verify} />
                    <p className="text-textPrimary font-nerisSemiBold text-3xl">
                      Password Changed!
                    </p>
                    <p className="text-textSecondary font-Poppins font-light mb-5  mt-3 text-center">
                      Your password has been changed <br />
                      successfully.
                    </p>

                    <Link
                      to="/login"
                      className="!text-white !font-nerisSemiBold !bg-primaryColor !text-center !px-15 !py-3 !rounded-md  !mb-8  hover:!scale-101 !duration-300 hover:!bg-white hover:!outline hover:!outline-primaryColor hover:!text-primaryColor"
                    >
                      Ok
                    </Link>
                  </div>
                </Modal>
                <Spin
                  spinning={spinning}
                  percent={percent}
                  size="large"
                  fullscreen
                />
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewPassword;
