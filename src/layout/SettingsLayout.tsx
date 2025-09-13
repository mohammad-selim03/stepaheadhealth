import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/provider/Sidebar";
import Navbar from "../components/shared/provider/Navbar";

const SettingsLayout = () => {
  const title = JSON.parse(localStorage.getItem("title") || "");
  return (
    <div className="bg-[#F2F8FF] min-h-screen">
      <Navbar />
      <div>
        <div className="bg-primaryColor text-white py-4 ps-16">
          <p className="text-2xl font-semibold">{title}</p>
        </div>
      </div>
      <div className="xl:flex xl:gap-5 xl:justify-between ">
        <Sidebar />
        <div className="w-full space-y-8 p-2 h-screen pt-7 ps-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
