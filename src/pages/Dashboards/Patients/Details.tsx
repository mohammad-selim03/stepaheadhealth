import Detail from "../../../components/Dashboards/patientDashboard/details/Detail";

const Details = () => {
  return (
   <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
      <Detail />
    </div>
  );
};

export default Details;
