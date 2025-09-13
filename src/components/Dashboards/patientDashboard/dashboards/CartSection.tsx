import { useQuery } from "@tanstack/react-query";
import {
  Card1Svg,
  Card2Svg,
  Card3Svg,
  Card4Svg,
} from "../../../../assets/svgContainer";
import { imageProvider } from "../../../../lib/imageProvider";
import { GetData } from "../../../../api/API";
import { useTranslation } from "react-i18next";
import Loader from "../../../common/Loader";

const CartSection = () => {
  const { t } = useTranslation("patientdashboard");
  // get prescription overview data
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-prescription"],
    queryFn: () => GetData("prescription"),
  });

  return isLoading ? (
    <p className="flex items-center justify-center h-40">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p>{t("somethingWentWrong")}</p>
  ) : (
    <div className="mt-10">
      {/* cards */}
      <div className="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-5">
        <div className="p-4 flex items-center gap-3 bg-white rounded-xl">
          <div>
            <div className="bg-primaryColor/5 p-4 rounded-xl w-fit h-fit">
              <img src={imageProvider.card2} />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-textPrimary font-nerisSemiBold text-[32px]">
              {data?.typeCounts?.New || "0"}
            </p>
            <p className="font-Poppins text-lg font-light text-textSecondary">
              {t("newRxRequest")}
            </p>
          </div>
        </div>
        {/* <div className="p-6 flex flex-col gap-3  bg-white rounded-xl transition-all duration-300 ">
          <div className="bg-primaryColor -hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <Card2Svg />
          </div>

          <div className="flex gap-2 "></div>
        </div> */}

        <div className="p-4 flex items-center gap-3 bg-white rounded-xl">
          <div className="bg-primaryColor/5 p-4 rounded-xl w-fit">
            <img src={imageProvider.card3} />
          </div>

          <div className="space-y-1">
            <p className="text-textPrimary font-nerisSemiBold text-[32px]">
              {data?.typeCounts?.Refill || "0"}
            </p>
            <p className="font-Poppins text-lg font-light text-textSecondary">
              {t("requestForRxRefillSidebar")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
