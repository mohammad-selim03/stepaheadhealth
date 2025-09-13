import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { CallbtnSvg, LocationSvg, MailtoSvg } from "../../assets/svgContainer";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { PostData } from "../../api/API";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import axios, { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

type Inputs = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  npiId: number;
  referralCode?: string;
};

type registerpayload = Inputs & {
  role: string;
};

const SignUp = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { t } = useTranslation("signup");

  const [role] = useState(() =>
    JSON.parse(localStorage.getItem("role") || "null")
  );
  const navigate = useNavigate();

  // const updateRole = (newRole: string) => {
  //   localStorage.setItem("role", JSON.stringify(newRole));
  //   setRoleStatus(newRole);
  //   setRole(newRole);
  // };

  const Register = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: registerpayload) =>
      PostData<Inputs>("/auth/register", payload),
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
        console.error("Non-Axios error:", error);
      }
    },
    onSuccess: () => {
      toast.success("Register Successfull.");
      navigate("/email-verify");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    defaultValues: {
      referralCode: referralCode || "",
    },
  });

  useEffect(() => {
    reset({
      referralCode: referralCode || "",
    });
  }, [reset, referralCode]);

  const pass = watch("password");
  // hooks.ts or inside your component
  const verifyNpi = async (id: number, combinedData: registerpayload) => {
    try {
      const response = await axios.get(`/api/npi/?version=2.1&number=${id}`);

      console.log("NPI verification data:", response?.data?.result_count);
      const success = response?.data?.result_count;
      console.log("success", success);
      if (!success) {
        Register.mutate(combinedData);
      } else {
        toast.error("NPI verification failed, Please Enter valid NPI Number");
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    localStorage.setItem("email", JSON.stringify(data?.email));

    const combinedData: registerpayload = {
      ...data,
      role: role,
    };
    if (role === "Clinician") {
      verifyNpi(Number(data?.npiId), combinedData);
    }
    if (role === "Patient") {
      // verifyNpi(Number(data?.npiId), combinedData);
      Register.mutate(combinedData);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("referral");
    setReferralCode(code);
  }, []);

  return (
    <div className="lg:my-[50px] my-10">
      <Container>
        <div className="3xl:flex-row 3xl:gap-5 items-center flex flex-col-reverse gap-10">
          <div className="w-full">
            <div className="lg:flex gap-5 items-center justify-center space-y-5 lg:space-y-0">
              <div className=" overflow-hidden rounded-md">
                <img
                  className="lg:h-[478px] object-cover rounded-md hover:scale-105 duration-300"
                  src={imageProvider.authorImg1}
                  alt="image"
                />
              </div>
              <div className=" overflow-hidden rounded-md">
                <img
                  className="lg:h-[478px]  object-cover  rounded-md hover:scale-105 duration-300"
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

          {/* {roleStatus ? ( */}
          <div className="bg-white outline outline-primaryColor rounded-md p-6 w-full order-1 3xl:order-2">
            <p className="md:text-[32px] text-2xl font-nerisSemiBold text-[#191919]">
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
                  {t("phoneLabel")}
                </label>
                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder={t("phonePlaceholder")}
                  type="text"
                  {...register("phone", {
                    required: t("phoneRequired"),
                    pattern: {
                      value:
                        /^(\+1\s?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
                      message: t("phonePattern"),
                    },
                  })}
                />
                {errors?.phone && (
                  <span className="text-red-500">{errors?.phone?.message}</span>
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
              <div className=" flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("confirmPasswordLabel")}
                </label>
                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                  placeholder={t("confirmPasswordPlaceholder")}
                  type="password"
                  {...register("confirmPassword", {
                    required: t("confirmPasswordRequired"),
                    minLength: {
                      value: 8,
                      message: t("confirmPasswordMinLength"),
                    },
                    validate: (value) => {
                      if (value !== pass) {
                        return t("passwordMismatch");
                      }
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {role === "Clinician" && (
                <div className=" flex gap-2 items-start flex-col mt-6">
                  <label className="text-textPrimary font-nerisSemiBold">
                    {t("npiLabel")}
                  </label>
                  <input
                    className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                    placeholder={t("npiPlaceholder")}
                    type="number"
                    {...register("npiId", {
                      required: t("npiRequired"),
                      minLength: {
                        value: 10,
                        message: t("npiMinLength"),
                      },
                    })}
                  />
                  {errors.npiId && (
                    <span className="text-red-500">{errors.npiId.message}</span>
                  )}
                </div>
              )}
              {role !== "Clinician" && (
                <div className=" flex gap-2 items-start flex-col mt-6">
                  <label className="text-textPrimary font-nerisSemiBold">
                    {t("referralLabel")}
                  </label>
                  <input
                    className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-primaryColor "
                    placeholder={t("referralPlaceholder")}
                    type="text"
                    {...register("referralCode", {
                      required: false,
                    })}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={Register.isPending}
                className="text-white font-nerisSemiBold bg-primaryColor text-center w-full py-3 rounded-md mt-6 cursor-pointer hover:scale-101 duration-300"
              >
                {Register.isPending ? (
                  <p>
                    <Loader />
                  </p>
                ) : (
                  t("createAccountButton")
                )}
              </button>

              <p className="text-textSecondary font-Poppins font-light text-center mt-5">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  to="/login"
                  className="text-[#195B91] font-nerisSemiBold underline text-nowrap"
                >
                  {t("loginNow")}
                </Link>
              </p>
            </form>
          </div>
          {/* ) : (
            <div className="w-full lg:w-1/2">
              <Onboarding
                roleStatus={roleStatus}
                setRoleStatus={setRoleStatus}
                setRole={setRole}
              />
            </div>
          )} */}
        </div>
      </Container>
    </div>
  );
};

export default SignUp;

// const Onboarding = ({
//   setRoleStatus,
//   setRole,
// }: {
//   roleStatus: boolean;
//   setRoleStatus: (value: boolean) => void;
//   setRole: (value: string) => void;
// }) => {
//   const { t } = useTranslation("signup");
//   const handleRole = (role: string) => {
//     localStorage.setItem("role", JSON.stringify(role));
//     setRole(role);
//   };

//   return (
//     <div className="">
//       <div className="bg-white outline outline-primaryColor rounded-md p-6 w-full order-1 3xl:order-2">
//         <h2 className="text-3xl font-semibold text-primaryColor">
//           {t("onboardingTitle")}
//         </h2>
//         <p className="text-textSecondary">
//           {t("onboardingSubtitle")}{" "}
//         </p>

//         <div className="py-10 flex flex-col gap-5">
//           <button
//             onClick={() => handleRole("Clinician")}
//             className={cn(
//               "border border-gray-300 rounded-lg px-4 py-4 w-full flex items-center gap-5 text-xl font-semibold text-textSecondary focus:border-primaryColor focus-within:bg-primaryColor/5"
//             )}
//           >
//             <ProviderRoleIcon />
//             <span>{t("providerButton")}</span>
//           </button>
//           <button
//             onClick={() => handleRole("Patient")}
//             className={cn(
//               "border border-gray-300 rounded-lg px-4 py-4 w-full flex items-center gap-5 text-xl font-semibold text-textSecondary focus:border-primaryColor focus-within:bg-primaryColor/5"
//             )}
//           >
//             <PatientRoleIcon />
//             <span>{t("patientButton")}</span>
//           </button>
//         </div>

//         <div className="py-10">
//           <button
//             // disabled={!roleStatus}
//             onClick={() => setRoleStatus(true)}
//             className="bg-primaryColor w-full px-5 py-2 rounded-2xl text-white"
//           >
//             {t("nextButton")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
