
import PaymentSetting from "../../../../components/Dashboards/ProviderDashboard/settings/PaymentSetting";


const PaymentSettings = () => {
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
       
       <PaymentSetting/> 
    </div>
  );
};

export default PaymentSettings;
