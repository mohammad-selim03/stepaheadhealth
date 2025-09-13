import { useMutation, useQuery } from "@tanstack/react-query";
import { GetData, PostData } from "../../../../api/API";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../../components/common/Loader";

const MailConfirm = () => {
  const [check, setCheck] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["clinician-profile"],
    queryFn: () => GetData("clinician/profile"),
  });
  const {
    data: status,
    isLoading: statusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["status", data?.dosespotId, check],
    queryFn: () => GetData(`idp/status/${data?.dosespotId}`),
    enabled: !!data?.dosespotId && check,
  });

  const navigate = useNavigate();

  const handleNavigate = () => {
    setCheck(true);
  };

  const redirectStripe = useMutation({
    mutationKey: ["stripe-redirect"],
    mutationFn: () => PostData("payment/clinician/onboard"),
    onSuccess: (data) => {
      window.location.replace(data?.data?.url);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to redirect stripe");
    },
  });

  // Add useEffect to handle the status changes
  useEffect(() => {
    if (check && !statusLoading && status) {
      if (status?.isVerified) {
        toast.success("IDP Verified");
        // navigate("/provider-setting/payment");
        redirectStripe.mutate();
      } else {
        toast.error("IDP Verification Pending");
      }
      setTimeout(() => {
        setCheck(false);
      }, 2000);
    }
  }, [status, statusLoading, check, navigate]);
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="max-w-[400px] mx-auto">
        <p className="text-2xl font-semibold text-center">IDP Verification</p>
        <p className="py-3 text-center">
          We have sent you a text message. Please check your message and
          complete the IDP verification.
        </p>
        <p className="pt-20 text-center flex items-start gap-0 text-textSecondary">
          <span className="pt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.66667 11C7.85556 11 8.014 10.936 8.142 10.808C8.27 10.68 8.33378 10.5218 8.33333 10.3333V7.66667C8.33333 7.47778 8.26933 7.31956 8.14133 7.192C8.01333 7.06444 7.85511 7.00044 7.66667 7C7.47822 6.99956 7.32 7.06356 7.192 7.192C7.064 7.32044 7 7.47867 7 7.66667V10.3333C7 10.5222 7.064 10.6807 7.192 10.8087C7.32 10.9367 7.47822 11.0004 7.66667 11ZM7.66667 5.66667C7.85556 5.66667 8.014 5.60267 8.142 5.47467C8.27 5.34667 8.33378 5.18844 8.33333 5C8.33289 4.81156 8.26889 4.65333 8.14133 4.52533C8.01378 4.39733 7.85556 4.33333 7.66667 4.33333C7.47778 4.33333 7.31956 4.39733 7.192 4.52533C7.06445 4.65333 7.00045 4.81156 7 5C6.99956 5.18844 7.06356 5.34689 7.192 5.47533C7.32045 5.60378 7.47867 5.66756 7.66667 5.66667ZM7.66667 14.3333C6.74445 14.3333 5.87778 14.1582 5.06667 13.808C4.25556 13.4578 3.55 12.9829 2.95 12.3833C2.35 11.7838 1.87511 11.0782 1.52533 10.2667C1.17556 9.45511 1.00045 8.58844 1 7.66667C0.999556 6.74489 1.17467 5.87822 1.52533 5.06667C1.876 4.25511 2.35089 3.54956 2.95 2.95C3.54911 2.35044 4.25467 1.87556 5.06667 1.52533C5.87867 1.17511 6.74533 1 7.66667 1C8.588 1 9.45467 1.17511 10.2667 1.52533C11.0787 1.87556 11.7842 2.35044 12.3833 2.95C12.9824 3.54956 13.4576 4.25511 13.8087 5.06667C14.1598 5.87822 14.3347 6.74489 14.3333 7.66667C14.332 8.58844 14.1569 9.45511 13.808 10.2667C13.4591 11.0782 12.9842 11.7838 12.3833 12.3833C11.7824 12.9829 11.0769 13.458 10.2667 13.8087C9.45644 14.1593 8.58978 14.3342 7.66667 14.3333ZM7.66667 13C9.15556 13 10.4167 12.4833 11.45 11.45C12.4833 10.4167 13 9.15555 13 7.66667C13 6.17778 12.4833 4.91667 11.45 3.88333C10.4167 2.85 9.15556 2.33333 7.66667 2.33333C6.17778 2.33333 4.91667 2.85 3.88333 3.88333C2.85 4.91667 2.33333 6.17778 2.33333 7.66667C2.33333 9.15555 2.85 10.4167 3.88333 11.45C4.91667 12.4833 6.17778 13 7.66667 13Z"
                fill="#F62720"
              />
            </svg>
          </span>
          <span>
            After a successful verification, click continue to create or connect your stripe account to receive payments.
          </span>
        </p>
        <div className="py-5 flex items-center justify-center">
          <button
            type="button"
            onClick={handleNavigate}
            className="px-10 bg-primaryColor py-2 rounded-xl text-white"
          >
            {statusLoading ? <Loader /> : <>Continue</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailConfirm;
