
import UpdatedProfile from "../../../components/Dashboards/patientDashboard/settings/UpdatedProfile";

const Settings = () => {
  return (
    <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
      <UpdatedProfile /> 
    </div>
  );
};

export default Settings;
