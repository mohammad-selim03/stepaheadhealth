import Detail from "../../../components/Dashboards/patientDashboard/details/Detail";

const PatientDetails = () => {
  return (
    <div>
      <div
        style={{
          maxHeight: "calc(100vh - 120px)",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="no-scrollbar"
      >
        <Detail />
      </div>
      ;
    </div>
  );
};

export default PatientDetails;
