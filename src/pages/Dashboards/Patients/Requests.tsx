import TableItem from "../../../components/Dashboards/patientDashboard/requests/TableItem";
import TopSection from "../../../components/Dashboards/patientDashboard/requests/TopSection";

const Requests = () => {
  return (
    <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
      <TopSection />
      <TableItem />
    </div>
  );
};

export default Requests;
