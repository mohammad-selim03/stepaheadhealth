import { useTranslation } from "react-i18next";
import { imageProvider } from "../../../lib/imageProvider";
import Title from "../../common/Title";

const RefillRequest = () => {
  const { t } = useTranslation("about");
  return (
    <div className="py-10 flex flex-col gap-5">
      <Title className="text-center font-nerisSemiBold">
        {t("refill.title")}
      </Title>
      <p className="text-center font-Poppins">
        {t("refill.subtitle")}
      </p>
      <div className="flex flex-col 2xl:flex-row items-start gap-8 pt-10">
        <img
          src={imageProvider.service}
          alt="service image"
          className="max-w-full 2xl:max-w-[718px] h-[300px] lg:h-[650px] object-cover rounded-xl hover:-translate-y-2 transition-all duration-300"
        />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-lg w-full ">
            <div className="flex flex-col gap-2 text-white items-center bg-primaryColor w-fit px-2 py-6 rounded-xl">
              <p className="font-nerisBlack text-3xl">01+</p>
              <p className="text-sm text-center text-nowrap">{t("refill.steps.one.title")}</p>
            </div>
            <p className="bg-white border border-gray-200 p-8 rounded-xl  font-nerisLight">
              {t("refill.steps.one.description")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-lg w-full ">
            <p className="bg-white border border-gray-200 p-8 rounded-xl  font-nerisLight">
              {t("refill.steps.two.description")}
            </p>
            <div className="flex flex-col gap-2 text-white items-center bg-primaryColor w-fit px-5 py-3 rounded-xl">
              <p className="font-nerisBlack text-3xl">02+</p>
              <p className="text-sm text-center">{t("refill.steps.two.title")}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-lg w-full ">
            <div className="flex flex-col gap-2 text-white items-center bg-primaryColor w-fit px-5 py-3 rounded-xl">
              <p className="font-nerisBlack text-3xl">03+</p>
              <p className="text-sm text-center">{t("refill.steps.three.title")}</p>
            </div>
            <p className="bg-white border border-gray-200 p-8 rounded-xl  font-nerisLight">
              {t("refill.steps.three.description")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-lg w-full ">
            <p className="bg-white border border-gray-200 p-8 rounded-xl  font-nerisLight">
              {t("refill.steps.four.description")}
            </p>
            <div className="flex flex-col gap-2 text-white items-center bg-primaryColor w-fit px-6 py-3 rounded-xl">
              <p className="font-nerisBlack text-3xl">04+</p>
              <p className="text-sm text-center">{t("refill.steps.four.title")}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-lg w-full ">
            <p className="bg-white border border-gray-200 p-8 rounded-xl  font-nerisLight">
              {t("refill.steps.five.description")}
            </p>
            <div className="flex flex-col gap-2 text-white items-center bg-primaryColor w-fit px-5 py-3 rounded-xl">
              <p className="font-nerisBlack text-3xl">05+</p>
              <p className="text-sm text-center">{t("refill.steps.five.title")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillRequest;
