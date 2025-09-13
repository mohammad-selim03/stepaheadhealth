import { useMutation, useQuery } from "@tanstack/react-query";
import { GetData, PostData } from "../../../api/API";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";

const ProviderRefer = () => {
  const { t } = useTranslation("providerdashboard");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const SendReferral = useMutation({
    mutationKey: ["send-ref"],
    mutationFn: (payload) => PostData("clinician/send-referral", payload),
    onSuccess: () => {
      toast.success(t("referral_link_sent_successfully"));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });
  const Refcode = useMutation({
    mutationKey: ["send-ref"],
    mutationFn: (payload) => PostData("clinician/referral-code", payload),
    onSuccess: () => {
      toast.success(t("referral_code_updated_successfully"));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const { data } = useQuery({
    queryKey: ["code"],
    queryFn: () => GetData("clinician/referral-code"),
  });
  // if (!email) return toast.error("Please Enter Email");
  const handleSendEmail = () => {
    SendReferral.mutate({ recipientEmail: email });
  };
  const handleSendCode = () => {
    Refcode.mutate({ referralCode: code });
  };
  return (
    <div>
      <div>
        <p className="py-5 text-3xl font-semibold p-3 rounded-xl">
          {t("refer_a_patient")}
        </p>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div className="flex flex-col items-start gap-3 bg-primaryColor p-5 text-white rounded-xl">
            <p className="bg-white p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M24.8948 17.814C24.7989 17.7256 24.6732 17.6764 24.5428 17.6764C24.4123 17.6764 24.2866 17.7256 24.1908 17.814L20.9578 21.052C20.8896 21.1217 20.8433 21.2097 20.8246 21.3053C20.8059 21.4009 20.8156 21.4999 20.8525 21.5901C20.8894 21.6803 20.9519 21.7577 21.0322 21.8128C21.1126 21.8678 21.2074 21.8982 21.3048 21.9H22.4108C22.3007 23.5618 21.6482 25.1416 20.5534 26.3966C19.4587 27.6517 17.9822 28.5128 16.3508 28.8475C16.2387 28.8703 16.138 28.9311 16.0657 29.0197C15.9934 29.1083 15.9541 29.2192 15.9543 29.3335C15.9556 29.4474 15.9956 29.5574 16.0676 29.6456C16.1397 29.7338 16.2395 29.7949 16.3508 29.819C17.5571 30.0585 18.8006 30.0375 19.9981 29.7573C21.1956 29.4771 22.3194 28.9442 23.2943 28.1944C24.2691 27.4446 25.0724 26.4951 25.6504 25.4095C26.2284 24.324 26.5678 23.1274 26.6458 21.9H27.7808C27.8787 21.8995 27.9743 21.87 28.0555 21.8153C28.1367 21.7606 28.1999 21.6831 28.2373 21.5925C28.2758 21.5021 28.286 21.402 28.2666 21.3056C28.2471 21.2092 28.1989 21.121 28.1283 21.0525L24.8948 17.814ZM6.97876 14.189C7.07181 14.2811 7.19739 14.3327 7.32826 14.3327C7.45913 14.3327 7.58472 14.2811 7.67776 14.189L10.9163 10.951C10.9862 10.8816 11.0338 10.793 11.0532 10.6964C11.0725 10.5998 11.0626 10.4996 11.0248 10.4086C10.987 10.3177 10.923 10.24 10.8409 10.1856C10.7587 10.1312 10.6623 10.1024 10.5638 10.103H9.45876C9.57076 8.44192 10.224 6.86324 11.3184 5.60861C12.4128 4.35398 13.8882 3.49251 15.5188 3.15604C15.6306 3.13277 15.731 3.07179 15.8031 2.98331C15.8753 2.89483 15.9149 2.78423 15.9153 2.67004C15.9164 2.55538 15.8773 2.44395 15.8048 2.35515C15.7322 2.26635 15.6308 2.2058 15.5183 2.18404C14.3122 1.94433 13.0689 1.96525 11.8716 2.24542C10.6744 2.52558 9.55082 3.05851 8.57638 3.80846C7.60194 4.55841 6.79912 5.50804 6.22175 6.59367C5.64438 7.67931 5.30582 8.87584 5.22876 10.103H4.09376C3.99629 10.1048 3.90144 10.1349 3.82083 10.1897C3.74022 10.2445 3.67736 10.3216 3.63994 10.4117C3.60252 10.5017 3.59218 10.6007 3.61017 10.6965C3.62817 10.7923 3.67373 ... [truncated]
                  fill="#195B91"
                />
                <path
                  d="M9.49943 15.3862C2.81093 15.4002 -0.00407243 23.9422 5.24443 27.9412C6.46969 28.8673 7.9636 29.3683 9.49943 29.3683C11.0353 29.3683 12.5292 28.8673 13.7544 27.9412C19.0024 23.9432 16.1874 15.3987 9.49943 15.3862ZM13.8194 26.5412C13.6552 25.6751 13.2335 24.8788 12.6094 24.2562C12.3174 24.0192 12.1864 23.6927 11.8894 24.0912C11.1792 24.701 10.2628 25.0163 9.32776 24.9726C8.3927 24.929 7.50969 24.5296 6.85943 23.8562C5.98526 24.5114 5.38636 25.4686 5.17943 26.5412C1.52443 22.8512 4.24993 16.3412 9.49943 16.3862C14.7484 16.3427 17.4744 22.8507 13.8194 26.5412ZM18.2444 14.9412C22.7144 18.4557 29.5419 15.1597 29.4994 9.38623C29.4974 7.53032 28.7593 5.751 27.447 4.43868C26.1347 3.12635 24.3553 2.38822 22.4994 2.38623C15.8109 2.40023 12.9959 10.9422 18.2444 14.9412ZM22.4994 3.38623C27.7484 3.34273 30.4744 9.85073 26.8194 13.5412C26.6553 12.6751 26.2336 11.8787 25.6094 11.2562C25.3174 11.0192 25.1864 10.6927 24.8894 11.0912C24.2586 11.6338 23.4611 11.9443 22.6294 11.9712C22.5663 11.9771 22.5028 11.9788 22.4394 11.9762C21.4656 11.9568 20.5386 11.5544 19.8594 10.8562C18.9853 11.5114 18.3864 12.4686 18.1794 13.5412C14.5244 9.85123 17.2499 3.34123 22.4994 3.38623Z"
                  fill="#195B91"
                />
                <path
                  d="M20.76 10.3309C21.0869 10.6111 21.4767 10.8081 21.8963 10.9051C22.3158 11.0022 22.7525 10.9964 23.1693 10.8882C23.5861 10.7801 23.9705 10.5728 24.2899 10.2841C24.6094 9.99534 24.8542 9.63366 25.0037 9.22986C25.1532 8.82606 25.2029 8.39212 25.1485 7.96498C25.0941 7.53785 24.9373 7.13019 24.6914 6.77672C24.4455 6.42326 24.1178 6.13447 23.7363 5.93496C23.3547 5.73544 22.9306 5.63111 22.5 5.63086C21.9571 5.63727 21.429 5.80814 20.9853 6.12093C20.5415 6.43372 20.2031 6.87371 20.0146 7.38283C19.8261 7.89195 19.7965 8.44626 19.9295 8.97258C20.0626 9.49891 20.3522 9.97251 20.76 10.3309Z"
                  fill="#195B91"
                />
              </svg>
            </p>
            <p>
              {t("total_referral_patients")}{" "}
              <span className="text-2xl font-semibold"></span>
            </p>
          </div>
        </div> */}
        <div className="py-5">
          <form className="p-7 bg-white">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-start gap-2">
                <label className="font-semibold">{t("referral_code")}</label>
                <input
                  type="text"
                  className="px-4 py-2 border border-gray-200 outline-0 rounded-xl w-full"
                  onChange={(e) => setCode(e.target.value)}
                  value={data?.referralCode || "N/A"}
                />
                <div className="w-full pt-4">
                  <button
                    type="button"
                    disabled
                    onClick={handleSendCode}
                    className="bg-primaryColor w-full py-2.5 rounded-xl text-white"
                  >
                    {Refcode.isPending ? <Loader /> : <> {t("your_code")}</>}
                  </button>
                </div>
              </div>{" "}
              {/* <div className="flex flex-col items-start gap-2">
                <label className="font-semibold">Your Referral Code</label>
                <input
                  type="text"
                  className="px-4 py-2 border border-gray-200 outline-0 rounded-xl w-full"
                />
              </div> */}
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-1/2 pt-4">
              <div className="flex flex-col items-start gap-2">
                <label className="font-semibold">
                  {t("send_your_referral_invite")}
                </label>
                <input
                  type="email"
                  className="px-4 py-2 border border-gray-200 outline-0 rounded-xl w-full"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>{" "}
              <div>
                <button
                  type="button"
                  disabled={!email}
                  onClick={handleSendEmail}
                  className="bg-primaryColor w-full py-2.5 rounded-xl text-white"
                >
                  {SendReferral?.isPending ? (
                    <p>
                      <Loader />
                    </p>
                  ) : (
                    <>{t("send_referral")}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderRefer;