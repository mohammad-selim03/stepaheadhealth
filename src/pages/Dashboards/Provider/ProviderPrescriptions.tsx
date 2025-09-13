import TableItem from "../../../components/Dashboards/ProviderDashboard/prescriptions/TableItem";



const ProviderPrescriptions = () => {
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
       <TableItem/>
    </div>
  );
};

export default ProviderPrescriptions;
