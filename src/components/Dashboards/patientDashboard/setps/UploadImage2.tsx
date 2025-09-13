import { useState } from "react";
import { Button, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next"; // Added import
import { UploadSvg } from "../../../../assets/svgContainer";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { GetData } from "../../../../api/API";
import { useQuery } from "@tanstack/react-query";

interface UserInfo {
  role?: string;
  [key: string]: any;
}

const UploadImage2 = () => {
  const { t } = useTranslation("providerdashboard"); // Initialize t function
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Get role from localStorage
  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  );
  const role = userInfo?.role;

  // First API call - Get profile data
  const { data: profData, isLoading: profDataLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData("clinician/profile"),
    retry: 2, // Added retry for better reliability
  });

  // Second API call - Get status (only enabled when dosespotId is available)
  const {
    data: status,
    isLoading: statusLoading,
    error: statusError,
    isFetching: statusIsFetching,
  } = useQuery({
    queryKey: ["status", profData?.dosespotId],
    queryFn: () => {
      if (!profData?.dosespotId) {
        throw new Error("No dosespotId available");
      }
      return GetData(`idp/status/${profData.dosespotId}`);
    },
    enabled: !!profData?.dosespotId, // Only run when dosespotId exists
    retry: 2, // Added retry for better reliability
  });

  const handleContinue = () => {
    // Check if profile data is still loading
    if (profDataLoading) {
      toast.info("Please wait while we load your profile data");
      return;
    }

    // Check if we have dosespotId but status is still loading
    if (profData?.dosespotId && (statusLoading || statusIsFetching)) {
      toast.info("Please wait while we verify your status");
      return;
    }

    // Check for errors
    if (statusError) {
      toast.error("Failed to load verification status");
      return;
    }

    // Check if image is uploaded
    if (fileList.length === 0) {
      toast.error(t("uploaderror"));
      return;
    }

    // Navigation logic
    if (status?.isVerified) {
      // Verified users go to their dashboard
      return navigate(
        role === "Clinician" ? "/provider-dashboard" : "/patient-dashboard"
      );
    }

    if (status?.idpStatus === "IDPInitializeSuccess") {
      // IDP initialized but not verified - go to verification
      return navigate("/idp/verification");
    }

    // Default case - go to verification
    return navigate("/idp/verification");
  };

  const handleSkip = () => {
    // Check if profile data is still loading
    if (profDataLoading) {
      toast.info("Please wait while we load your profile data");
      return;
    }

    // Check if we have dosespotId but status is still loading
    if (profData?.dosespotId && (statusLoading || statusIsFetching)) {
      toast.info("Please wait while we verify your status");
      return;
    }

    // Check for errors
    if (statusError) {
      toast.error("Failed to load verification status");
      return;
    }

    // Navigation logic
    if (status?.isVerified) {
      // Verified users go to their dashboard
      return navigate(
        role === "Clinician" ? "/provider-dashboard" : "/patient-dashboard"
      );
    }

    if (status?.idpStatus === "IDPInitializeSuccess") {
      // IDP initialized but not verified - go to mail confirmation
      return navigate("/idp/mail-confirmation");
    }

    // Default case - go to verification
    return navigate("/idp/verification");
  };

  // Get the token from localStorage
  const token = JSON.parse(localStorage.getItem("token") || "null");

  return (
    <div className="my-10">
      <div className="max-w-[1480px] mx-auto px-2">
        <Toaster />
        <p className="text-textPrimary font-nerisSemiBold text-xl w-fit mx-auto mb-6">
          {t("uploadimage")}
        </p>
        <ImgCrop rotationSlider>
          <Upload
            action={`${import.meta.env.VITE_BASE_URL}/clinician/profile/avatar`}
            headers={{
              Authorization: `Bearer ${token}`,
            }}
            listType="picture-card"
            name="avatar"
            fileList={fileList}
            onChange={onChange}
            className="upload-custom"
            maxCount={1}
            multiple={false}
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: true,
            }}
          >
            {fileList.length < 1 && (
              <div className="flex flex-col gap-2 items-center">
                <UploadSvg />
                <p className="text-textSecondary font-nerisSemiBold">
                  {t("draganddrop")}
                </p>
              </div>
            )}
          </Upload>
        </ImgCrop>

        <div className="md:flex-row gap-5 items-center flex flex-col justify-center mt-15">
          <Button
            onClick={handleSkip}
            className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
          >
            {t("skip")}
          </Button>
          <Button
            onClick={handleContinue}
            className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage2;