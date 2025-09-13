import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Call1Svg,
  Location1Svg,
  TelePhoneSvg,
} from "../../../../assets/svgContainer";
import { Button, Modal, Input } from "antd";
import { imageProvider } from "../../../../lib/imageProvider";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import Setp3 from "../setps/Setp3";
import Loader from "../../../common/Loader";

const initialPharmacyData = [
  {
    id: 1,
    name: "CVS/pharmacy #4261",
    location: "2055 E VICTORY",
    phone: "9123520303",
    fax: "8559108606",
  },
  {
    id: 2,
    name: "CVS/pharmacy #4261",
    location: "2088 E VICTORY",
    phone: "9123520358",
    fax: "8559108685",
  },
  {
    id: 3,
    name: "CVS/pharmacy #4261",
    location: "2088 E VICTORY",
    phone: "9123520358",
    fax: "8559108685",
  },
];

type pharmacyData = {
  storeName: string;
  address1: string;
  city: string;
  state: string;
  primaryPhone: string;
  zipCode: string;
};

const CartSection = () => { 
  const { t } = useTranslation("patientdashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [errors, setErrors] = useState({});

  const { data, isLoading, error } = useQuery<pharmacyData>({
    queryKey: ["pharmacy"],
    queryFn: () => GetData("pharmacy"),
  });

  const openEditModal = (pharmacy) => {
    setSelectedPharmacy({ ...pharmacy });
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
    <p className="font-nerisSemiBold md:text-3xl text-xl w-full p-3 rounded-xl">
          {t("changePharmacy")}
        </p>
      <div className="bg-white rounded-2xl sm:p-6 p-2 pb-15 ">
        

        {isLoading ? (
          <p className="h-96 flex items-center justify-center">
            <Loader color="#000000" />
          </p>
        ) : error ? (
          <p className="h-40 flex items-center justify-center">
            {error?.response?.data?.message || t("somethingWentWrong")}
          </p>
        ) : (
          <div className="grid 2xl:grid-cols-2 4xl:grid-cols-3 gap-2">
            <div className=" w-full sm:h-[403px] mt-5">
              <div className="bg-[#F2F8FF] px-5 2xl:px-2 3xl:px-5 4xl:px-5 py-6 rounded-b-xl">
                <p className="font-nerisSemiBold text-textPrimary">
                  {data?.storeName || "N/A"}
                </p>

                <div className="flex flex-wrap flex-col sm:flex-row sm:items-center mt-2">
                  <div className="flex gap-1 items-center sm:border-r sm:pr-2">
                    <Location1Svg />
                    <p className="text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.address1}, {data?.city}, {data?.state}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center sm:border-r sm:px-2">
                    <Call1Svg />
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-nowrap">
                      {data?.primaryPhone}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Location1Svg />
                    <p className=" text-sm sm:text-[10px] md:text-xs text-textSecondary text-wrap">
                      {t("zipCode")} {data?.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                  {/* <Button
                onClick={() =>
                  navigate("/request-rx-refill", {
                    state: { startFromStep: 1 },
                  })
                }
                className="!bg-primaryColor  md:!h-10 !h-8 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300"
              >
                Select & Proceed
              </Button> */}

                  <Button
                    onClick={() => openEditModal(data)}
                    className="!bg-white md:!h-10 !h-8 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor hover:!text-white hover:!scale-105 !transition-all !duration-300"
                  >
                    {t("changePharmacy")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for editing */}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          centered
          footer={false}
        >
          <Setp3
            changePharmacy={t("changePharmacy")}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CartSection;
