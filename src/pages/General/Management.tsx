import { Button } from "antd";
import { CheckIcon } from "../../components/Generals/Home/HomeIcons";
import { management, medicalAttention } from "../../lib/StaticData";

const Management = () => {
  return (
    <div className="py-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start justify-center gap-3">
        <div className="flex flex-col gap-4 border border-primaryColor p-5 rounded-xl bg-white h-full">
          <p className="text-2xl font-semibold pb-2">Common Causes</p>
          {management?.map((data, idx) => (
            <p key={idx} className="text-textSecondary flex items-center gap-2">
              <CheckIcon /> {data}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-4 border border-primaryColor p-5 rounded-xl bg-white h-full">
          <p className="text-2xl font-semibold pb-2">Potential Causes</p>
          {medicalAttention?.indicators?.map((data, idx) => (
            <p key={idx} className="text-textSecondary flex items-center gap-2">
              <CheckIcon />
              {data}
            </p>
          ))}
          <p className="text-textSecondary flex items-center gap-2">{medicalAttention?.recommendation}</p>
        </div>
      </div>
      <div className="py-10 flex items-center justify-center">
        <Button className="!bg-primaryColor !px-5 !h-10 !rounded-xl !text-white font-nerisLight">Get Help For Fibromyalgia</Button>
      </div>
    </div>
  );
};

export default Management;
