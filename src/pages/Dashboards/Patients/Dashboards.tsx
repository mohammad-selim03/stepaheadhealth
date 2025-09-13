import CartSection from "../../../components/Dashboards/patientDashboard/dashboards/CartSection";
import TableItem from "../../../components/Dashboards/patientDashboard/dashboards/TableItem";
import TopSection from "../../../components/Dashboards/patientDashboard/dashboards/TopSection";

const Dashboards = () => {
  return (
    <div>
      <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <TopSection />
        <CartSection />
        <TableItem />
      </div>
    </div>
  );
};

export default Dashboards;
