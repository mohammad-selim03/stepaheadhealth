import { useMutation } from "@tanstack/react-query";
import { CallbtnSvg, LocationSvg, MailtoSvg } from "../../assets/svgContainer";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { Flex, Input } from "antd";
import type { GetProps } from "antd";
import { useNavigate } from "react-router";
import { PostData } from "../../api/API";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type OTPProps = GetProps<typeof Input.OTP>;

type OtpPayload = {
  email: string;
  otp: string;
};

type VerifyOtpResponse = {
  data: {
    resetToken: string;
  };
};

const Verification = () => {
  const navigate = useNavigate();

  const OtpVerify = useMutation<
    VerifyOtpResponse,
    AxiosError<{ message: string }>,
    OtpPayload
  >({
    mutationKey: ["otp-code"],
    mutationFn: (payload) => PostData("/auth/verify-otp", payload),
    onSuccess: (data) => {
      toast.success("Email verified.");
      navigate("/new-password");
      console.log("tok", data);
      localStorage.setItem("resetToken", JSON.stringify(data.data.resetToken));
    },
    onError: (err) =>
      toast.error(
        err?.response?.data?.message || "Something went wrong, try again."
      ),
  });

  const user: { email: string } | undefined = (() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch (error) {
      return undefined;
    }
  })();
  // OTP input change handler
  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
    if (!user?.email) return;
    const data: OtpPayload = {
      email: user.email,
      otp: text,
    };
    OtpVerify.mutate(data);
  };
  const onInput: OTPProps["onInput"] = (value) => {
    console.log("onInput:", value);
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput,
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
              OTP Verification
            </p>
            <p className="text-base font-light font-Poppins text-[#5A5C5F] mt-4">
              Don't worry! It occurs. Please enter the code that send to your
              email.
            </p>

            <div className="mt-10 mx-auto w-fit">
              <Flex gap="large" align="flex-start" vertical>
                <Input.OTP
                  length={4}
                  size="large"
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                  }}
                  {...sharedProps}
                />
              </Flex>
            </div>

            <button className="text-white font-nerisSemiBold bg-primaryColor text-center w-full py-3 rounded-md mt-6 cursor-pointer hover:scale-101 duration-300">
              {OtpVerify.isPending ? (
                <p>
                  <Loader />
                </p>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Verification;
