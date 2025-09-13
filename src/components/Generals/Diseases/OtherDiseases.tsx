import { otherDiseases } from "../../../lib/StaticData";
import Title from "../../common/Title";

const OtherDiseases = () => {
  return (
    <div className="py-10">
      <Title className="text-center font-nerisLight font-semibold pb-5">
        Other Diseases
      </Title>
      <div className="p-5 rounded-2xl bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 border border-primaryColor">
        {otherDiseases?.map((data, idx) => (
          <p key={idx} className="bg-[#F2F8FF] p-5 rounded-md font-nerisLight font-semibold">{data}</p>
        ))}
      </div>
    </div>
  );
};  

export default OtherDiseases;
