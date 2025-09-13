
import ProviderSettings from "../../../../components/Dashboards/ProviderDashboard/settings/ProviderSettings";


const ProviderSetting = () => {
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
       
       <ProviderSettings/>
        
        
    </div>
  );
};

export default ProviderSetting;
