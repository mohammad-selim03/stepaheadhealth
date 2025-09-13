import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const MainLayout = () => {
  return (
    <div className="bg-[#F8F9FA]">
      <ScrollRestoration />
      <Navbar />
      <div className="pt-28 pb-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
