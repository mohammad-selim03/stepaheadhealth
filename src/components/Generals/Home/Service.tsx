import { Button } from "antd";
import { imageProvider } from "../../../lib/imageProvider";
import Title from "../../common/Title";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Service = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div className="py-10 flex flex-col items-start gap-5">
      <div className="flex flex-col 2xl:flex-row items-start gap-8 w-full">
        <img
          src={imageProvider.service}
          alt="service image"
          className="w-full max-w-[718px] h-[550px] object-cover rounded-xl hover:-translate-y-2 transition-all duration-300"
        />
        <div className="font-nerisLight">
          <Title className="font-semibold">{t("home.service.title")}</Title>
          <p className="font-light pt-5 font-Poppins">
            {t("home.service.description")}
          </p>
          <div className="pt-10 2xl:pt-28">
            <ServiceCards data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;

const ServiceCards = ({ data }) => {
  const { t } = useTranslation();
  console.log("data", data);
  const role = JSON.parse(localStorage.getItem("role") || "null");
  const is_profile_created = JSON.parse(
    localStorage.getItem("is_profile_created") || "null"
  );
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2  gap-5">
      <div className="flex flex-col gap-3 group hover:-translate-y-2 hover:bg-primaryColor transition-all duration-300 shadow-md shadow-black/20 bg-white text-black hover:text-white p-5 rounded-xl">
        <div>
          <p className="py-4 font-nerisLight font-semibold">
            {t("home.service.cards.refills.title")}
          </p>
          <p>{t("home.service.cards.refills.description")}</p>
        </div>
        <div className="flex items-center gap-3 pt-20">
          <Link
            to={
              role == "Patient" && is_profile_created
                ? "/request-rx-refill"
                : "/patient"
            }
            className="!px-8 !text-white flex items-center justify-center !h-10 !rounded-xl group-hover:!text-primaryColor  !border-primaryColor !bg-primaryColor group-hover:!bg-white"
          >
            {t("home.service.cards.refills.button")}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 group hover:-translate-y-2 hover:bg-primaryColor transition-all shadow-md shadow-black/20 duration-300 bg-white text-black hover:text-white p-5 rounded-xl">
        <div>
          <p className="py-4 font-nerisLight font-semibold">
            {t("home.service.cards.consultation.title")}
          </p>
          <p>{t("home.service.cards.consultation.description")}</p>
        </div>
        <div className="flex items-center gap-3 pt-20">
          <Link
            to={
              role === "Patient" && is_profile_created
                ? "/patient-dashboard"
                : "/patient"
            }
            className="!px-8 !h-10 flex items-center justify-center !rounded-xl group-hover:!text-primaryColor !text-white  !border-primaryColor  !bg-primaryColor   group-hover:!bg-white"
          >
            {t("home.service.cards.consultation.button")}
          </Link>
        </div>
      </div>
    </div>
  );
};
