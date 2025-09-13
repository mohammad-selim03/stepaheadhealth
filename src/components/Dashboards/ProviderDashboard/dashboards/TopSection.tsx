import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GetData } from "../../../../api/API";

const TopSection = () => {
  const { data } = useQuery({
    queryKey: ["prof"],
    queryFn: () => GetData("clinician/profile"),
  });
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-full p-3 rounded-xl">
        <p className="font-nerisSemiBold md:text-[32px] text-2xl">
          {t("welcome_back", {
            firstName: data?.firstName,
            lastName: data?.lastName,
          })}
        </p>
        {/* <p className="font-nerisLight md:text-base text-xs">
          {t("coming_up_activity")}
        </p> */}
      </div>
    </div>
  );
};

export default TopSection;
