import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card1Svg, Card3Svg, Card4Svg } from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import { GetData } from "../../../../api/API";
import Loader from "../../../common/Loader";

const CartSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => GetData("prescription"),
  });
  const { t } = useTranslation();
  return isLoading ? (
    <Loader />
  ) : error ? (
    <p>{t("something_went_wrong")}</p>
  ) : (
    <div className="mt-10">
      {/* cards */}
      <div className="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        <div className="p-6 flex flex-col gap-3 bg-white rounded-xl ">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.card1} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <Card1Svg />
          </div>

          <div className="flex gap-2 ">
            <p className="font-Poppins text-nowrap text-sm 2xl:text-lg font-light text-textSecondary mt-2 group-hover:text-white">
              {t("completed_request")}
            </p>
            <p className="text-textPrimary font-nerisSemiBold text-2xl 2xl:text-[32px] group-hover:text-white">
              {data?.statusCounts?.Completed || "0"}
            </p>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3 bg-white rounded-xl ">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.card4} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <Card4Svg />
          </div>

          <div className="flex gap-2 ">
            <p className="font-Poppins  text-nowrap text-sm 2xl:text-lg font-light text-textSecondary mt-2 group-hover:text-white">
              {t("new_request")}
            </p>
            <p className="text-textPrimary font-nerisSemiBold text-2xl 2xl:text-[32px] group-hover:text-white">
              {data?.statusCounts?.Pending || "0"}
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 bg-white rounded-xl ">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.card3} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <Card3Svg />
          </div>

          <div className="flex gap-2 ">
            <p className="font-Poppins text-nowrap text-sm 2xl:text-lg font-light text-textSecondary mt-2 group-hover:text-white">
              {t("in_progress")}
            </p>
            <p className="text-textPrimary font-nerisSemiBold  text-2xl 2xl:text-[32px] group-hover:text-white">
              {data?.statusCounts?.Approved || "0"}
            </p>
          </div>
        </div>
        {/* <div className="p-6 flex flex-col gap-3 bg-white rounded-xl ">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.card3} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <Card3Svg />
          </div>

          <div className="flex gap-2 ">
            <p className="font-Poppins text-nowrap text-sm 2xl:text-lg font-light text-textSecondary mt-2 group-hover:text-white">
              Canceled
            </p>
            <p className="text-textPrimary font-nerisSemiBold  text-2xl 2xl:text-[32px] group-hover:text-white">
              {data?.statusCounts?.Rejected || "0"}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CartSection;
