import { Button } from "antd";
import { imageProvider } from "../../../lib/imageProvider";
import Title from "../../common/Title";
import { PatientIcon, ProviderIcon } from "./HomeIcons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Start = () => {
  const { t } = useTranslation();
  return (
    <div className="py-5 lg:py-10">
      <div className="bg-gradient-to-b from-white to-[#BADFFD] max-h-full md:max-h-[591px] w-full rounded-xl p-6">
        <div className="flex flex-col items-center justify-center">
          <Title className="font-nerisSemiBold">{t("home.start.title")}</Title>
        </div>
        <div className="flex flex-col md:flex-row items-end pt-5 gap-5">
          <Provider />
          <div className="hidden lg:flex">
            <img src={imageProvider.start} alt="" />
          </div>
          <Patient />
        </div>
      </div>
    </div>
  );
};

export default Start;

const Provider = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-primaryColor p-6 rounded-md text-white w-fit">
      <p className="text-2xl font-nerisSemiBold flex items-center gap-2">
        <ProviderIcon />
        {t("home.start.provider.title")}
      </p>
      <p className="pt-2 pb-16">{t("home.start.provider.description")}</p>
      <Link to={"/choose-role"}>
        <Button className="!bg-white !px-5 !h-10 !rounded-xl   !text-primaryColor hover:!scale-105 !transition-all !duration-300">
          {t("home.start.provider.button")}
        </Button>
      </Link>
    </div>
  );
};
const Patient = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-md text-black w-fit">
      <p className="text-2xl font-nerisSemiBold flex items-center gap-2">
        <PatientIcon />
        {t("home.start.patient.title")}
      </p>
      <p className="pt-2 pb-16">{t("home.start.patient.description")}</p>
      <Link to={"/choose-role"}>
        <Button className="!bg-primaryColor !px-5 !h-10 !rounded-xl !border !border-primaryColor !text-white hover:!scale-105 !transition-all !duration-300">
          {t("home.start.patient.button")}
        </Button>
      </Link>
    </div>
  );
};
