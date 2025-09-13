import { useState } from "react";
import { Button, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadSvg } from "../../../../assets/svgContainer";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const UploadImage = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleContinue = () => {
    if (fileList.length === 0) {
      toast.error(
        "Please upload an image before continuing or You can skip this page"
      );
    } else {
      console.log("Uploaded Image:", fileList[0]);
      navigate("/provider-dashboard");
    }
  };

  return (
    <div className="my-10">
      <div className="max-w-[1480px] mx-auto px-2">
        <Toaster />
        <p className="text-textPrimary font-nerisSemiBold text-xl w-fit mx-auto mb-6">
          Upload Image
        </p>
        <ImgCrop rotationSlider>
          <Upload
            action={`${import.meta.env.VITE_BASE_URL}/patient/profile/avatar`}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            className="upload-custom"
            maxCount={1}
            multiple={false}
            showUploadList={{
              showPreviewIcon: false, // This hides the view button
              showRemoveIcon: true, // This keeps the delete button
            }}
          >
            {fileList.length < 1 && (
              <div className="flex flex-col gap-2 items-center">
                <UploadSvg />
                <p className="text-textSecondary font-nerisSemiBold">
                  Drag & Drop a file here <br /> or click
                </p>
              </div>
            )}
          </Upload>
        </ImgCrop>

        <div className="md:flex-row gap-5 items-center flex flex-col justify-center mt-15">
          <Button
            onClick={() => navigate("/provider-dashboard")}
            className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
          >
            Skip
          </Button>
          <Button
            onClick={handleContinue}
            className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;