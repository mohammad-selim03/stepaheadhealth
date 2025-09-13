import CartSection from "../../../components/Dashboards/ProviderDashboard/dashboards/CartSection";
import TableItem from "../../../components/Dashboards/ProviderDashboard/dashboards/TableItem";
import TopSection from "../../../components/Dashboards/ProviderDashboard/dashboards/TopSection";
import { useGlobalNotification } from "../Patients/GlobalNotificationProvider";

const ProviderDashboard = () => {
  const { addTestNotification } = useGlobalNotification();

  return (
    <div>
      {/* <button
        onClick={addTestNotification}
        className="px-3 py-2 bg-blue-600 text-white rounded shadow"
      >
        Test Notification (Dashboard)
      </button> */}
      <div
        className="px-2 no-scrollbar overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <TopSection />
        <CartSection />
        <TableItem />
      </div>
    </div>
  );
};

export default ProviderDashboard;
