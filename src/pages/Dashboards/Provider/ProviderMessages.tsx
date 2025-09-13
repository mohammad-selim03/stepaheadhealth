import Message from "../../../components/Dashboards/ProviderDashboard/message/Message";

const ProviderMessages = () => {
  return (
    <div style={{
          maxHeight: "calc(100vh - 120px)",
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="no-scrollbar  -mt-10">
    <Message/>
    </div>
  );
};

export default ProviderMessages;
