import Title from "../../common/Title";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";

const TopDiseases = ({ lang }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["diseases"],
    queryFn: () => GetData("cms/disease-title"),
  });
  const {
    data: list,
    isLoading: listLoading,
    error: listError,
  } = useQuery({
    queryKey: ["diseases-list"],
    queryFn: () => GetData("cms/disease"),
  });

  const diseases = t("home.topdiseases.diseases", {
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
  ) : listLoading ? (
    <Loader />
  ) : (
    <div className="py-5 lg:py-10 flex items-center justify-center w-full">
      <div>
        <Title className="text-center">
          {lang === "es"
            ? data?.titleEs
            : data?.title || t("home.topdiseases.title")}
        </Title>
        <p className="text-center font-Poppins font-light text-textSecondary px-5 lg:px-20 py-2">
          {lang === "es"
            ? data?.subTitleEs
            : data?.subTitleEs || t("home.topdiseases.subtitle")}
        </p>
        {list?.length < 1 ? (
          <p className="flex items-center justify-center h-40">No Data Found</p>
        ) : (
          <div className="border-2 border-primaryColor rounded-xl bg-white p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {list &&
              list?.map((data, idx) => (
                <p
                  // to={"/diseases"}
                  key={idx}
                  className="py-5 bg-[#F2F8FF] px-3 rounded-md font-nerisSemiBold"
                >
                  {lang === "es" ? data?.diseaseEs : data?.disease}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDiseases;
