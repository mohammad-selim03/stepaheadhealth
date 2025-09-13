import { symptomsData } from "../../../lib/StaticData";
import { WorksIcon } from "../Home/HomeIcons";

const Symptoms = () => {
  return (
    <div className="py-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 bg-white p-5 rounded-xl border border-primaryColor">
      {symptomsData?.map((data, idx) => (
        <div key={idx} className="flex items-start gap-5 bg-[#F8F9FA] p-3 rounded-xl">
          <p className="bg-primaryColor p-3 rounded-md w-fit">
            <WorksIcon />
          </p>
          <div>
            <p className="text-lg font-semibold font-nerisLight">
              {data?.title}
            </p>
            <p className="font-light text-textSecondary">{data?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Symptoms;
