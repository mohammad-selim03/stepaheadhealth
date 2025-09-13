import { Button } from "antd";
import Setup from "../../../components/Dashboards/patientDashboard/rxSteps/Setup";
import { Link } from "react-router";

const RxSteps = () => {
  return (
    <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
      <div className=" flex justify-between items-center pr-5">
        <p className="text-textPrimary font-nerisSemiBold lg:text-[32px] md:text-2xl sm:text-xl text-base">
          Request For RX Refill
        </p>
        <Link to="/patient-dashboard">
          <Button className="!bg-white lg:!h-10 md:!h-8 !h-6 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105 lg:!px-15 !px-5">
            Cancel
          </Button>
        </Link>
      </div>

      <Setup />
    </div>
  );
};

export default RxSteps;
