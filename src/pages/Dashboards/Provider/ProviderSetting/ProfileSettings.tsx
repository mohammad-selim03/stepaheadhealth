import ProfileSetting from "../../../../components/Dashboards/ProviderDashboard/settings/ProfileSetting";


const ProfileSettings = () => {
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
       
       <ProfileSetting/>
        
        
    </div>
  );
};

export default ProfileSettings;
