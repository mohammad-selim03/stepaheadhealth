import Title from "../../common/Title";
import { WorksIcon } from "./HomeIcons";
import { useTranslation } from "react-i18next";

// works data type define
type worksData = {
  title: string;
  description: string;
};

const Works = () => {
  const { t } = useTranslation();
  const WorksData = t("home.works.steps", { returnObjects: true }) as worksData[];
  return (
    <div>
      <Title className="text-center font-nerisLight font-semibold">
        {t("home.works.title")}
      </Title>
      <p className="py-5 text-textSecondary text-center">
        {t("home.works.description")}
      </p>
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WorksData?.map((data, idx) => (
          <WorksCard key={idx} data={data} idx={idx} />
        ))}
      </div>
    </div>
  );
};

export default Works;

const WorksCard = ({ data, idx }: { data: worksData; idx: number }) => {
  return (
    <div className="relative p-6 flex flex-col gap-3 border border-primaryColor rounded-xl hover:bg-primaryColor bg-white hover:text-white transition-all duration-300 group">
      <p className="bg-primaryColor group-hover:bg-white/20 transition-all duration-300 p-3 rounded-xl w-fit">
        <WorksIcon className="group-hover:fill-primaryColor" />
      </p>
      <div>
        <p>{data?.title}</p>
        <p>{data?.description}</p>
      </div>
      <p
        className="absolute -top-16 right-5 text-[204px] opacity-5 font-Poppins font-bold bg-gradient-to-b from-[#195B91] to-[#033E6E]"
        style={{
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {idx + 1}
      </p>
    </div>
  );
};
