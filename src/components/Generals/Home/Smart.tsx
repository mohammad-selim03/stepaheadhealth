import { Button } from "antd";
import { imageProvider } from "../../../lib/imageProvider";
import Title from "../../common/Title";
import { AppleIcon, PlaystoreIcon } from "./HomeIcons";
import { useTranslation } from "react-i18next";

const Smart = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-5 md:pt-32 flex items-center justify-center font-nerisSemiBold">
      <div>
        <div className="relative">
          <img
            src={imageProvider.smart}
            className="w-full h-full pt-14 "
            alt=""
          />
          <div className="absolute bottom-0 bg-gradient-to-t from-[#F8F9FA] to-transparent h-60 w-full z-20" />
        </div>
        <div className="pt-10 relative z-30">
          <Title className="text-center">{t("home.smart.title")}</Title>
          <p className="py-6 text-center font-Poppins font-light">
            <span dangerouslySetInnerHTML={{ __html: t("home.smart.description") }} />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 py-5">
            <Button className="!flex !items-center !px-7 !border !border-primaryColor !gap-3 !h-14 !rounded-xl !font-semibold hover:!scale-105 !transition-all !duration-300">
              {t("home.smart.googlePlay")} <PlaystoreIcon />
            </Button>
            <Button className="!flex !items-center !gap-3 !h-14 !rounded-xl !bg-black !text-white !border-black !font-semibold hover:!scale-105 !transition-all !duration-300">
              {t("home.smart.appStore")} <AppleIcon />{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smart;
