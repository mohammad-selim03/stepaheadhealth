import { Button } from "antd";
import Title from "../../common/Title";
import { imageProvider } from "../../../lib/imageProvider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router"

const Provider = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full 3xl:h-[514px] p-5 md:p-12 bg-primaryColor rounded-xl text-white font-nerisLight flex flex-wrap 3xl:flex-nowrap items-start 3xl:items-center justify-center gap-8">
      <div className="flex flex-col gap-8">
        <Title className="font-nerisBlack">{t("home.provider.title")}</Title>
        <p>
          {t("home.provider.description")}
        </p>
        <Link to={"/choose-role"}>
          <Button className="!bg-white w-fit !font-semibold !px-8 !h-12 hover:!text-primaryColor !text-primaryColor !rounded-xl hover:!scale-105 !transition-all !duration-300">
            {t("home.provider.button")}
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 w-full">
        <img
          src={imageProvider.provider1}
          alt="provider one"
          className="w-[300px] lg:max-w-[392px] h-[418px] rounded-xl object-cover"
        />
        <img
          src={imageProvider.provider2}
          alt="provider two"
          className="w-[300px] lg:max-w-[392px] h-[418px] rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default Provider;
