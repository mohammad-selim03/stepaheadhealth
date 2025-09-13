import Title from "../../common/Title";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";

const TopMedicalConditions = ({ lang }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-care"],
    queryFn: () => GetData("cms/care-section"),
  });
  const {
    data: list,
    isLoading: listLoading,
    error: listError,
  } = useQuery({
    queryKey: ["cms-care-list"],
    queryFn: () => GetData("cms/care"),
  });

  const conditions = t("home.topmedicalconditions.conditions", {
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
      <div className="w-full">
        <Title className="text-center pb-5">
          {lang === "es"
            ? data?.titleEs
            : data?.title || t("home.topmedicalconditions.title")}
        </Title>

        {listLoading ? (
          <p className="h-96 flex items-center justify-center">
            <Loader color="#000000" />
          </p>
        ) : listError ? (
          <p className="flex items-center justify-center h-screen">
            Something went wrong.
          </p>
        ) : (
          <div className="border-2 border-primaryColor rounded-xl bg-white p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
            {list &&
              list?.map((data, idx) => (
                <p
                  // to={"/diseases"}
                  key={idx}
                  className="py-5 bg-[#F2F8FF] px-3 rounded-md font-nerisSemiBold"
                >
                  {lang === "es" ? data?.careEs : data?.care}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMedicalConditions;
