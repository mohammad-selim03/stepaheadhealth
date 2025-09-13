import { useEffect, useState } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import Container from "../../../shared/Container";
import { UploadSvg } from "../../../../assets/svgContainer";

type UploadPictureProps = {
  avatar?: string; // image URL
};

const UploadPicture = ({ avatar }: UploadPictureProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const token = JSON.parse(localStorage.getItem("token") || "null");

  // Load default avatar (if provided)
  useEffect(() => {
    if (avatar) {
      setFileList([
        {
          uid: "-1", // unique identifier
          name: "avatar.png",
          status: "done",
          url: avatar,
        },
      ]);
    }
  }, [avatar]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="my-5">
      <Container>
        <p className="text-textPrimary font-nerisSemiBold text-xl w-fit mx-auto mb-6">
          Upload Image
        </p>
        <ImgCrop rotationSlider>
          <Upload
            action={`${import.meta.env.VITE_BASE_URL}/patient/profile/avatar`}
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
                <p className="text-textSecondary font-nerisSemiBold text-center">
                  Drag & Drop a file here <br /> or click
                </p>
              </div>
            )}
          </Upload>
        </ImgCrop>
      </Container>
    </div>
  );
};

export default UploadPicture;
