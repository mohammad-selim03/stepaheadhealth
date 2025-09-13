import { Outlet } from "react-router";
import Navbar from "../components/shared/patient/Navbar";
import { Sidebar } from "../components/shared/patient/Sidebar";
import Footer from "../components/shared/Footer";
import { useContext } from "react";
import { MainContext } from "../provider/ContextProvider";

const PatientLayout = () => {
  const { title } = useContext(MainContext);
  return (
    <div className="min-h-screen bg-[#F2F8FF]">
      <Navbar />
      <div className="bg-primaryColor text-white py-4 ps-16">
        <p className="text-2xl font-semibold">{title}</p>
      </div>
      <div className="xl:flex xl:gap-5 xl:justify-between bg-[#F2F8FF]">
        {/* Sidebar part */}
        <div className="">
          <Sidebar />
        </div>

        {/* Main content part */}
        <div className="flex-1 w-full space-y-5 pt-5 px-1 sm:px-2 md:px-5 bg-[#F2F8FF]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientLayout;
