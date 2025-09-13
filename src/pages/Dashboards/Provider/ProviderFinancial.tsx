import CartSection from "../../../components/Dashboards/ProviderDashboard/financial/CartSection";
import TableItem from "../../../components/Dashboards/ProviderDashboard/financial/TableItem";

const ProviderFinancial = () => {
  return (
    <div
      style={{
          maxHeight: "calc(100vh - 120px)",
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="no-scrollbar px-2"
    >
      <CartSection />
      <TableItem />
    </div>
  );
};

export default ProviderFinancial;
