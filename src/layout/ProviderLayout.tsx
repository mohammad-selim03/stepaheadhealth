import { Outlet } from "react-router";
import { Sidebar } from "../components/shared/provider/Sidebar";
import Navbar from "../components/shared/provider/Navbar";
import Footer from "../components/shared/Footer";
import { useContext } from "react";
import { MainContext } from "../provider/ContextProvider";

const ProviderLayout = () => {
  const { title } = useContext(MainContext);
  return (
    <div className="min-h-screen bg-[#F2F8FF] w-full">
      <Navbar />
      <div className="bg-primaryColor text-white py-4 ps-16">
        <p className="text-2xl font-semibold">{title}</p>
      </div>
      <div className="xl:flex xl:gap-5 xl:justify-between">
        {/* Sidebar part */}
        <div className=" ">
          <Sidebar />
        </div>

        {/* Main content part */}
        <div className="w-full space-y-5 p-2 h-screen bg-[#F2F8FF]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderLayout;
