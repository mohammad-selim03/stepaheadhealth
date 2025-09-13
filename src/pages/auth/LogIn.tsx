import { Link, useLocation, useNavigate } from "react-router";
import { CallbtnSvg, LocationSvg, MailtoSvg } from "../../assets/svgContainer";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "../../api/API";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../provider/AuthContext";
import { useState } from "react";
import DynamicModal from "../../components/common/Modal";
import { useTranslation } from "react-i18next";

type Inputs = {
  email: string;
  password: string;
};
type logData = {
  data: {
    email: string;
    id: string;
    isActive: boolean;
    npiId: number;
    role: string;
    isProfileCreated: boolean;
  };
  message: string;
  success: boolean;
  token: string;
};

const LogIn = () => {
  const { t } = useTranslation("login");
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { login } = useAuth();

  const Signin = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: Inputs) => PostData<logData>("/auth/login", payload),
    // onSuccess: (data: logData) => {
    //   login(data);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000);
    //   localStorage.setItem("token", JSON.stringify(data?.token));
    //   localStorage.setItem("userInfo", JSON.stringify(data?.data));
    //   localStorage.setItem("role", JSON.stringify(data?.data?.role));
    //   localStorage.setItem(
    //     "is_profile_created",
    //     JSON.stringify(data?.data?.isProfileCreated)
    //   );
    //   setIsProfileCreated(data?.data?.isProfileCreated);
    //   setIsModalOpen(true);
    //   setTempData(data);
    //   console.log("data", data);
    //   if (data?.data?.isProfileCreated == false) {
    //     if (data?.data?.role == "Clinician") {
    //       navigate("/provider-steps");
    //     } else {
    //       navigate("/patient");
    //     }
    //   }
    //   const redirect =
    //     data?.data?.role == "Clinician" ? "/provider-steps" : "/patient";
    //   if (!data?.data?.isProfileCreated)
    //     return navigate(from || redirect, {
    //       replace: true,
    //     });
    //   if (
    //     data?.data?.isProfileCreated === true &&
    //     data?.data?.idpVerified === false &&
    //     data?.data?.role == "Clinician"
    //   ) {
    //     // If not verified, navigate to IDP verification
    //     navigate("/idp/verification");
    //     // setTimeout(() => {
    //     //   window.location.reload();
    //     // }, 1000);
    //   } else {
    //     // If verified, navigate to intended destination or fallback
    //     navigate(
    //       from ||
    //         (data?.data?.role === "Clinician"
    //           ? "/provider-dashboard"
    //           : "/patient-dashboard"),
    //       {
    //         replace: true,
    //       }
    //     );
    //   }
    // },
    onSuccess: (data: logData) => {
      // Perform login and store data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      login(data);
      localStorage.setItem("token", JSON.stringify(data?.token));
      localStorage.setItem("userInfo", JSON.stringify(data?.data));
      localStorage.setItem("role", JSON.stringify(data?.data?.role));
      localStorage.setItem(
        "is_profile_created",
        JSON.stringify(data?.data?.isProfileCreated)
      );

      // Update state
      setIsProfileCreated(data?.data?.isProfileCreated);
      setIsModalOpen(true);
      setTempData(data);
      console.log("data", data);

      // Determine navigation path
      const isProfileCreated = data?.data?.isProfileCreated;
      const role = data?.data?.role;
      const isIdpVerified = data?.data?.idpVerified;

      let redirectPath = from; // Use 'from' if provided (e.g., from protected route)

      if (!isProfileCreated) {
        // Profile not created: Navigate based on role
        redirectPath = role === "Clinician" ? "/provider-steps" : "/patient";
      } else if (role === "Clinician" && !isIdpVerified) {
        // Profile created but not verified (for Clinician): Navigate to IDP verification
        redirectPath = "/idp/verification";
      } else {
        // Profile created and verified (or not Clinician): Navigate to dashboard
        redirectPath =
          role === "Clinician" ? "/provider-dashboard" : "/patient-dashboard";
      }

      // Perform navigation
      navigate(redirectPath, { replace: true });
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. try again."
      );
    },
  });

  const handleOk = () => {
    setIsModalOpen(false);
    // Check IDP verification status
    const redirect =
      tempData?.data?.role == "Clinician" ? "/provider-steps" : "/patient";
    if (!isProfileCreated)
      return navigate(from || redirect, {
        replace: true,
      });
    if (
      isProfileCreated === true &&
      tempData?.data?.idpVerified === false &&
      tempData?.data?.role == "Clinician"
    ) {
      // If not verified, navigate to IDP verification
      navigate("/idp/verification", { state: { reload: true } });
    } else {
      // If verified, navigate to intended destination or fallback
      navigate(
        from ||
          (tempData?.data?.role === "Clinician"
            ? "/provider-dashboard"
            : "/patient-dashboard"),
        {
          replace: true,
        }
      );
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    Signin.mutate(data);
  };

  return (
    <div className="lg:my-[50px] my-10">
      <>
        <DynamicModal
          handleOk={handleOk}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          title={t("loginSuccessTitle")}
          subTitle={t("loginSuccessSubTitle")}
        />
      </>
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
                {t("health")}
              </p>
              <div className="lg:flex justify-between gap-6">
                <div className="bg-white rounded-md p-6 mt-6  h-[174px] w-full">
                  <div className="bg-primaryColor rounded-full text-center p-3 w-[48px] h-[48px] mx-auto">
                    <LocationSvg />
                  </div>
                  <p className="text-base font-Poppins font-light mt-2 text-center">
                    {t("contact")}
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
                    {t("tollFree")}
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
                    {t("email")}
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
            <p className="text-[32px] font-nerisSemiBold text-[#191919] 3xl:mt-20">
              {t("title")}
            </p>
            {/* <p className="text-base font-light font-Poppins text-[#5A5C5F] mt-4">
              Community Living and Support Services in Houston, Texas
            </p> */}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex gap-2 items-start flex-col mt-8">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("emailLabel")}
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  {...register("email", { required: t("emailRequired") })}
                />
                {errors.email && (
                  <span className="text-red-500">{t("emailRequired")}</span>
                )}
              </div>

              <div className=" flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("passwordLabel")}
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder={t("passwordPlaceholder")}
                  type="password"
                  {...register("password", {
                    required: t("passwordRequired"),
                    minLength: {
                      value: 8,
                      message: t("passwordMinLength"),
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={Signin.isPending}
                className="text-white font-nerisSemiBold bg-primaryColor text-center w-full py-3 rounded-md mt-6 cursor-pointer hover:scale-101 duration-300"
              >
                {Signin.isPending ? (
                  <p>
                    <Loader />
                  </p>
                ) : (
                  t("loginButton")
                )}
              </button>
              <div className="md:flex-row justify-between flex flex-col items-center ">
                <p className="text-textSecondary font-Poppins font-light text-center mt-5">
                  {t("noAccount")}{" "}
                  <Link
                    to="/choose-role"
                    className="text-[#195B91] font-nerisSemiBold underline text-nowrap"
                  >
                    {t("registerNow")}
                  </Link>
                </p>

                <Link
                  to="/forgot-password"
                  className="text-[#D80027] font-nerisSemiBold underline md:mt-5 mt-1"
                >
                  {" "}
                  {t("forgotPassword")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LogIn;
