import ChangePassword from "../../../../components/Dashboards/ProviderDashboard/settings/ChangePassword";


const ChangePasswords = () => {
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
       
       <ChangePassword/>
        
        
    </div>
  );
};

export default ChangePasswords;
