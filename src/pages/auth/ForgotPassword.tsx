import { useNavigate } from "react-router";
import { CallbtnSvg, LocationSvg, MailtoSvg } from "../../assets/svgContainer";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "../../api/API";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import type { AxiosError } from "axios";

type Submittype = {
  email: string;
};

type Inputs = {
  email: string;
  password: string;
};
const ForgotPassword = () => {
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const Submit = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (payload: Submittype) =>
      PostData("/auth/forgot-password", payload),
    onSuccess: (data) => {
      console.log("forgot data", data);
      toast.success("OTP code send to you mail");
      navigator("/Verification");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err.response?.data?.message || "Something went wrong, try again."
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    Submit.mutate(data);
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
            <p className="lg:text-[32px] text-2xl font-nerisSemiBold text-[#191919] 3xl:mt-40">
              Forgot Password?
            </p>
            <p className="text-base font-light font-Poppins text-[#5A5C5F] mt-4">
              Don't worry! It occurs. Please enter the email address linked with
              your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex gap-2 items-start flex-col mt-8">
                <label className="text-textPrimary font-nerisSemiBold">
                  Email
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder="Enter Email Here"
                  type="email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-500">Email is required</span>
                )}
              </div>

              <button
                type="submit"
                className="text-white font-nerisSemiBold bg-primaryColor text-center w-full py-3 rounded-md mt-6 cursor-pointer hover:scale-101 duration-300"
              >
                {Submit.isPending ? (
                  <p>
                    <Loader />
                  </p>
                ) : (
                  "Send Code"
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
