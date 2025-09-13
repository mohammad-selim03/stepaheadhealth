import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { imageProvider } from "../../lib/imageProvider";
import Container from "./Container";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { SpanishSvg, UkSvg } from "../../assets/svgContainer";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";
import { useAuth } from "../../provider/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../api/API";   

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const NavElement = [
    { path: "/", label: t("Home") },
    { path: "/about", label: t("About") },
    { path: "/contact-us", label: t("Contact Us") },
  ];

  const NavItem = () => (
    <ul className="flex gap-8 items-center">
      {NavElement.map((item, index) => (
        <li key={index} className="text-textSecondary font-nerisLight">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive ? "text-textPrimary font-nerisSemiBold" : ""
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
  const NavItem1 = () => (
    <ul className="flex flex-col items-start gap-4">
      {NavElement.map((item, index) => (
        <li
          key={index}
          className="!text-textSecondary !font-nerisLight text-base"
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "!text-textPrimary !font-nerisSemiBold"
                : " !text-textSecondary  !font-nerisLight"
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const [open, setOpen] = useState(false);
  const [placement] = useState<DrawerProps["placement"]>("right");

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const [selectedImg, setSelectedImg] = useState(
    <img src={imageProvider.american_flag} alt="" className="h-6 rounded-md" />
  );

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "es") {
      setSelectedImg(<SpanishSvg />);
    } else {
      setSelectedImg(
        <img
          src={imageProvider.american_flag}
          alt=""
          className="h-5 rounded-md"
        />
      );
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            setSelectedImg(
              <img
                src={imageProvider.american_flag}
                alt=""
                className="h-5 rounded-md"
              />
            );
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
          }}
        >
          <div className="w-8 h-8">
            <img
              src={imageProvider.american_flag}
              alt=""
              className="h-5 rounded-md"
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            setSelectedImg(<SpanishSvg />);
            i18n.changeLanguage("es");
            localStorage.setItem("lang", "es");
          }}
        >
          <div className="w-8 h-8">
            <SpanishSvg />
          </div>
        </div>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("is_profile_created");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const query =
    userInfo?.role == "Patient" ? "patient/profile" : "clinician/profile";
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData(query),
  });

  const getDashboardRoute = () => {
    const isEmptyData = data === undefined || data === null;

    if (userInfo?.role === "Patient") {
      return isEmptyData ? "/patient" : "/patient-dashboard";
    }

    if (userInfo?.role === "Clinician") {
      return isEmptyData ? "/provider-steps" : "/provider-dashboard";
    }

    return "/"; // fallback if role is not Patient or Clinician
  };

  const menus = [
    {
      key: "1",
      label: <Link to={getDashboardRoute()}>{t("Dashboard")}</Link>,
    },
    {
      key: "2",
      label: <button onClick={handleLogout}>{t("Logout")}</button>,
    },
  ];

  const { isLoggedIn } = useAuth();

  return (
    <div className="pt-9 fixed w-full z-50">
      <Container>
        <div className="flex items-center justify-between bg-white py-3 px-5 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] rounded-lg">
          {/* Logo */}
          <Link to="/" className=" overflow-hidden">
            <img
              className="w-[137px] h-[32px] object-cover"
              src={imageProvider.logo}
              alt="Logo"
            />
          </Link>
          {/* Navbar */}
          <div className="hidden lg:block">
            <NavItem />
          </div>
          {/* Language and Btn */}

          <div className="lg:flex gap-6 items-center hidden">
            <div className="flex items-center gap-10">
              <Dropdown menu={{ items }}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                    {selectedImg}
                  </div>
                  <DownOutlined style={{ color: "black" }} />
                </div>
              </Dropdown>
            </div>
            <div>
              {isLoggedIn ? (
                <div>
                  <Dropdown menu={{ items: menus }} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <img
                          src={data?.avatar || imageProvider.defaultImg}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="!text-white !font-nerisSemiBold !px-6 !py-2 !bg-primaryColor !rounded-lg"
                >
                  {t("Log In or Sign Up")}
                </Link>
              )}
            </div>
          </div>

          <div onClick={showDrawer} className="lg:hidden">
            <img className="h-8 w-8 " src={imageProvider.Menubar} />
          </div>
          {/* Mobile screen */}
          <Drawer
            placement={placement}
            width={300}
            onClose={onClose}
            open={open}
            closable={false}
          >
            <div className=" flex flex-col gap-5 justify-between mt-3">
              <Link to="/" onClick={onClose} className=" overflow-hidden">
                <img
                  className="w-[137px] h-[32px] object-cover"
                  src={imageProvider.logo}
                  alt="Logo"
                />
              </Link>

              <div onClick={onClose}>
                <NavItem1 />
              </div>

              <div className="flex flex-col gap-6 items-start">
                <div className="flex items-center gap-10">
                  <Dropdown menu={{ items }}>
                    <div className="flex gap-2 items-center cursor-pointer">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        {selectedImg}
                      </div>
                      <DownOutlined style={{ color: "black" }} />
                    </div>
                  </Dropdown>
                </div>
                <div>
                  {userInfo && userInfo?.email ? (
                    <div>
                      <Dropdown menu={{ items: menus }} trigger={["click"]}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space>
                            <img
                              src={data?.avatar || imageProvider.defaultImg}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="!text-white !font-nerisSemiBold !px-6 !py-2 !bg-primaryColor !rounded-lg"
                    >
                      {t("Log In or Sign Up")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
