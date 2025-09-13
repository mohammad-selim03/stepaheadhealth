import { Modal } from "antd";
import { imageProvider } from "../../lib/imageProvider";

const DynamicModal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  subTitle,
  handleOk,
}) => {


  return (
    <div>
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        footer={false}
        centered
        width={"40%"}
      >
        <div className="flex flex-col items-center justify-center gap-5 p-10">
          <div>
            <img src={imageProvider.modalPopup} alt="" />
          </div>
          <p className="text-3xl font-semibold pt-5">{title || ""}</p>
          <p className="text-base text-textSecondary text-center">
            {subTitle || ""}
          </p>
          <div className="pt-10 flex items-center justify-center w-1/2 mx-auto">
            <button
              onClick={handleOk}
              className="bg-primaryColor w-full px-10 py-3 rounded-xl text-white"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DynamicModal;
