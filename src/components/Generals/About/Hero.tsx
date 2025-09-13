import { useTranslation } from "react-i18next";
import { imageProvider } from "../../../lib/imageProvider";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";

const Hero = () => {
  const { t } = useTranslation("about");

  const { data } = useQuery({
    queryKey: ["count"],
    queryFn: () => GetData("admin/count"),
  });
  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5  w-full">
        <p className="w-full md:w-1/2 text-5xl font-black font-nerisBlack">
          {t("hero.title")}
        </p>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-1/2">
          <p className="text-textSecondary">{t("hero.description")}</p>
        </div>
      </div>
      {/* images */}
      <DocImages data={data} />
    </div>
  );
};

export default Hero;

const DocImages = ({ data }) => {
  console.log("data", data)
  const { t } = useTranslation("about");
  return (
    <div className="py-10 font-nerisLight">
      <div className="flex items-start gap-3 lg:gap-6">
        <div className="flex flex-col items-start gap-3 lg:gap-6 w-1/2">
          <div>
            <div className="flex flex-wrap items-center gap-3 lg:gap-6">
              <img
                src={imageProvider.docs1}
                alt="first doct image"
                className="max-w-[180px] md:max-w-[280px] 2xl:max-w-[351px] h-[351px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
              />
              <img
                src={imageProvider.docs2}
                alt="second doct image"
                className="max-w-[180px] md:max-w-[351px]  h-[351px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start lg:items-center gap-5 rounded-lg w-full ">
            <div className="flex flex-col gap-5 text-white items-center bg-primaryColor w-fit p-5 rounded-xl">
              <p className="font-nerisBlack text-3xl">
                {data?.totalClinicians || 0}+
              </p>
              <p>{t("hero.providers")}</p>
            </div>
            <p className="bg-white border border-gray-200 p-6 rounded-xl  font-nerisLight">
              {t("hero.cardDescription")}
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5  rounded-lg w-full ">
            <div className="flex flex-col gap-5 text-white items-center bg-primaryColor w-fit p-5 py-8 rounded-xl">
              <p className="font-nerisBlack text-3xl">{data?.totalPatients}+</p>
              <p className="text-nowrap">{t("hero.patientsHelped")}</p>
            </div>
            <p className="bg-white border border-gray-200 p-6 rounded-xl  font-nerisLight">
              {t("hero.cardDescription")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <img
              src={imageProvider.docs1}
              alt="first doct image"
              className="max-w-[180px] md:max-w-[280px] 2xl:max-w-[351px] h-[351px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
            />
            <img
              src={imageProvider.docs2}
              alt="second doct image"
              className="max-w-[180px] md:max-w-[351px] h-[351px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
