import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { imageProvider } from "../../../lib/imageProvider";
import {
  DashSvg1,
  DashSvg10,
  DashSvg11,
  DashSvg15,
  DashSvg2,
  DashSvg22,
  DashSvg3,
  DashSvg33,
  DashSvg4,
  DashSvg44,
  DashSvg5,
  DashSvg55,
  LogoutSvg,
  SearchSvg,
} from "../../../assets/svgContainer";
import { useContext, useState } from "react";
import { MainContext } from "../../../provider/ContextProvider";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType;
  activeIcon: React.ComponentType;
  subLinks?: SubLink[];
}

interface SubLink {
  path: string;
  label: string;
}

const NavItem = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation("patientdashboard");
  const NavElement: NavItem[] = [
    {
      path: "/patient-dashboard",
      label: t("dashboard"),
      icon: DashSvg1,
      activeIcon: DashSvg11,
    },
    // {
    //   path: "/request",
    //   label: "Rx Refills & Requests",
    //   icon: DashSvg2,
    //   activeIcon: DashSvg22,
    // },
    {
      path: "/payment",
      label: t("paymentAndReceipts"),
      icon: DashSvg3,
      activeIcon: DashSvg33,
    },
    {
      path: "/pharmacy",
      label: t("changePharmacy"),
      icon: DashSvg4,
      activeIcon: DashSvg44,
    },
    {
      path: "/my-clinician",
      label: t("myProvider"),
      icon: DashSvg10,
      activeIcon: DashSvg15,
    },
    {
      path: "/setting",
      label: t("settings"),
      icon: DashSvg5,
      activeIcon: DashSvg55,
    },
  ];
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const location = useLocation();

  const isSubLinkActive = (subLinks: SubLink[] | undefined) => {
    return subLinks?.some((subLink) => location.pathname === subLink.path);
  };

  const isExpanded = (index: number, item: NavItem) => {
    return expandedItem === index || isSubLinkActive(item.subLinks);
  };

  const toggleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const { setTitle } = useContext(MainContext);

  return (
    <ul className="flex flex-col gap-3">
      {NavElement.map((item, index) => (
        <li key={index} className="text-textSecondary font-nerisLight">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive || isSubLinkActive(item.subLinks)
                ? "!text-primaryColor !font-nerisSemiBold !text-lg"
                : "!text-textSecondary !text-lg !font-nerisLight"
            }
            onClick={() => {
              if (item.subLinks) {
                toggleExpand(index);
              } else if (onClose) {
                onClose();
              }
              setTitle(item?.label);
              localStorage.setItem("title", JSON.stringify(item?.label));
            }}
            end
          >
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center text-nowrap ${
                  isActive || isSubLinkActive(item.subLinks)
                    ? "bg-[#F2F8FF] rounded-l-2xl py-3 px-5 w-[330px]"
                    : "px-5 py-3"
                }`}
              >
                {isActive || isSubLinkActive(item.subLinks) ? (
                  <item.activeIcon />
                ) : (
                  <item.icon />
                )}
                {item.label}
              </div>
            )}
          </NavLink>

          {item.subLinks && isExpanded(index, item) && (
            <ul className="ml-2 mt-3 mr-3 bg-[#F2F8FF] rounded-2xl pl-8 p-4">
              {item.subLinks?.map((subLink, subIndex, subLinksArray) => (
                <li key={subIndex}>
                  <NavLink
                    to={subLink.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block px-2 rounded-2xl ${
                        isActive
                          ? "!text-primaryColor !font-nerisSemiBold"
                          : "!text-textSecondary !font-nerisLight"
                      }`
                    }
                    end
                  >
                    {subLink.label}
                    {subIndex !== subLinksArray.length - 1 && (
                      <hr className="border border-white my-4" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export const Sidebar = () => {
  const { step1, setStep1 } = useContext(MainContext)!;

  const toggleDrawer1 = () => {
    setStep1(step1 === 1 ? 0 : 1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => GetData("patient/profile"),
  });

  return (
    <div className="bg-white">
      {/* destop view */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-center h-20 flex items-center justify-center">Data not found</p>
      ) : (
        <div className="hidden xl:flex flex-col items-center justify-center pt-5">
          <img
            src={data?.avatar}
            alt=""
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex flex-col items-center justify-center ">
            <p className="text-xl font-semibold">
              {data?.firstName || ""} {data?.lastName || ""}
            </p>
            <p>{data?.address1 || "N/A"}</p>
            <p>
              {data?.city || ""}, {data?.state || ""}
            </p>
          </div>
        </div>
      )}
      <div className="w-[350px] bg-white pl-10 h-screen xl:block hidden">
        <div className="mt-10">
          <NavItem />
        </div>
        {/* <hr className="mt-10 border border-[#F2F8FF] mx-5" /> */}
        {/* <button onClick={handleLogOut} className="flex gap-2 pl-5 mt-8 ">
            <LogoutSvg />
            <Link
              to="/"
              className="text-textSecondary font-nerisLight hover:text-primaryColor hover:font-nerisSemiBold duration-300"
            >
              Log Out
            </Link>
          </button> */}
      </div>

      <Drawer
        placement="left"
        closable={false}
        open={step1 === 1}
        onClose={toggleDrawer1}
        width={360}
        style={{ padding: 0 }}
        className="no-padding-drawer"
        maskClosable={true}
      >
        <div className="!bg-white mt-5">
          <div className="flex justify-end px-5  pl-10">
            <button onClick={toggleDrawer1}>
              <CloseOutlined />
            </button>
          </div>
          <div className="xl:hidden flex flex-col items-center justify-center pt-5">
            <img
              src={data?.avatar || imageProvider?.defaultImg}
              alt=""
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex flex-col items-center justify-center ">
              <p className="text-xl font-semibold">
                {data?.firstName || ""} {data?.lastName || ""}
              </p>
              <p>{data?.address1 || "N/A"}</p>
              <p>
                {data?.city || ""}, {data?.state || ""}
              </p>
            </div>
          </div>

          {/* <div className=" pl-10">
            <Link to="/" onClick={toggleDrawer1}>
              <img
                className="w-[180px] h-[42px]"
                src={imageProvider.logo}
                alt="App Logo"
              />
            </Link>
          </div> */}

          {/* <div className=" flex  items-center gap-3  mt-5 md:hidden  border border-[#D9D9D9] rounded-2xl px-4 py-2 w-full max-w-[300px]">
            <SearchSvg />
            <input
              className="text-[#7B7B7B] w-full focus:outline-none bg-transparent"
              type="search"
              placeholder="Search anything here..."
              aria-label="Search"
            />
          </div> */}

          <div className="mt-10  pl-10">
            <NavItem onClose={toggleDrawer1} />
          </div>
          {/* <hr className="mt-10 border border-[#F2F8FF] mx-5" /> */}
          {/* <button onClick={handleLogOut} className="flex gap-2 pl-5 mt-8">
            <LogoutSvg />
            <Link
              to="/"
              onClick={toggleDrawer1}
              className="!text-textSecondary !font-nerisLight hover:!text-primaryColor hover:!font-nerisSemiBold !duration-300"
            >
              Log Out
            </Link>
          </button> */}
        </div>
      </Drawer>
    </div>
  );
};
