import { Toaster } from "react-hot-toast";
import { useNotificationSocket } from "./hooks/useNotificationSocket";

const App = () => {
  useNotificationSocket();
  return (
    <div>
      {/* Your main application content (e.g., routing, layout components) will be rendered here */}
      <Toaster />
    </div>
  );
};

export default App;
