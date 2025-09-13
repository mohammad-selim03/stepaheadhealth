import Title from "../../common/Title";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";

const TopMedications = ({ lang }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["medication-care"],
    queryFn: () => GetData("cms/medication-section"),
  });
  const {
    data: list,
    isLoading: listLoading,
    error: listError,
  } = useQuery({
    queryKey: ["medication-care-list"],
    queryFn: () => GetData("cms/medication"),
  });

  const medications = t("home.topmedications.medications", {
    returnObjects: true,
  }) as string[];

  return isLoading ? (
    <p className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p className="flex items-center justify-center h-screen">
      Something went wrong.
    </p>
  ) : (
    <div className="py-5 lg:py-10 flex items-center justify-center w-full">
      <div>
        <Title className="text-center">
          {lang === "es"
            ? data?.titleEs
            : data?.title || t("home.topmedications.title")}
        </Title>
        <p className="text-center font-Poppins font-light text-textSecondary px-5 lg:px-20 py-2">
          {lang === "es"
            ? data?.subTitleEs
            : data?.subTitle || t("home.topmedications.subtitle")}
        </p>
        <div className="border-2 border-primaryColor rounded-xl bg-white p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {list &&
            list?.map((data, idx) => (
              <p
                // to={"/diseases"}
                key={idx}
                className="py-5 bg-[#F2F8FF] px-3 rounded-md font-nerisSemiBold !text-wrap overflow-hidden"
              >
               
                {lang === "es" ? data?.medicationEs : data?.medication}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopMedications;
