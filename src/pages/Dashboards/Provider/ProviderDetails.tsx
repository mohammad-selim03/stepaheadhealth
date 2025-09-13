import Detail from "../../../components/Dashboards/ProviderDashboard/details/Detail";

const ProviderDetails = () => {
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 120px)",
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="no-scrollbar"
    >
        <Detail/>
    </div>
  );
};

export default ProviderDetails;
