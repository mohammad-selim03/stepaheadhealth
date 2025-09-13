import { commonCauses } from "../../../lib/StaticData";
import { CheckIcon } from "../Home/HomeIcons";

const Causes = () => {
  return (
    <div className="py-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-3">
        <div className="flex flex-col gap-4 border border-primaryColor p-3 rounded-xl bg-white">
          <p className="text-2xl font-semibold pb-2">Common Causes</p>
          {commonCauses?.map((data, idx) => (
            <p key={idx} className="text-textSecondary flex items-center gap-2">
              <CheckIcon /> {data}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-4 border border-primaryColor p-3 rounded-xl bg-white">
          <p className="text-2xl font-semibold pb-2">Potential Causes</p>
          {commonCauses?.map((data, idx) => (
            <p key={idx} className="text-textSecondary flex items-center gap-2">
              <CheckIcon />
              {data}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Causes;
