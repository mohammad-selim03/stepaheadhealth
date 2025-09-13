import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { imageProvider } from "../../../lib/imageProvider";
import {
  DashSvg1,
  DashSvg11,
  DashSvg3,
  DashSvg33,
  DashSvg5,
  DashSvg55,
  Financial1Svg,
  FinancialSvg,
  SearchSvg,
} from "../../../assets/svgContainer";
import { Drawer } from "antd";
import { MainContext } from "../../../provider/ContextProvider";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GetData } from "../../../api/API";

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

export const handleLogOut = () => {
  localStorage.removeItem("email");
  localStorage.removeItem("is_profile_created");
  localStorage.removeItem("role");
  localStorage.removeItem("state");
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");

  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

// const NavElement: NavItem[] = [
//   {
//     path: "/provider-dashboard",
//     label: "Dashboard",
//     icon: DashSvg1,
//     activeIcon: DashSvg11,
//   },
//   // {
//   //   path: "/provider-all-prescriptions",
//   //   label: "All Prescriptions",
//   //   icon: DashSvg2,
//   //   activeIcon: DashSvg22,
//   // },
//   {
//     path: "/provider-pinancial-dashboard",
//     label: "Financial Dashboard",
//     icon: FinancialSvg,
//     activeIcon: Financial1Svg,
//   },
//   {
//     path: "/provider-refer-patient",
//     label: "Refer A Patient",
//     icon: DashSvg3,
//     activeIcon: DashSvg33,
//   },
//   {
//     path: "/provider-setting/profile",
//     label: "Settings",
//     icon: DashSvg5,
//     activeIcon: DashSvg55,
//     subLinks: [
//       { path: "/provider-setting/profile", label: "Profile Setting" },
//       { path: "/provider-setting/provider", label: "Provider Setting" },
//       { path: "/provider-setting/payment", label: "Payment Setting" },
//       { path: "/provider-setting/change-password", label: "Change Password" },
//     ],
//   },
// ];

const NavItem = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation("providerdashboard");
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

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData("clinician/profile"),
  });
  const NavElement: NavItem[] = [
    {
      path: "/provider-dashboard",
      label: t("dashboard"),
      icon: DashSvg1,
      activeIcon: DashSvg11,
    },
    // {
    //   path: "/provider-all-prescriptions",
    //   label: "All Prescriptions",
    //   icon: DashSvg2,
    //   activeIcon: DashSvg22,
    // },
    {
      path: "/provider-pinancial-dashboard",
      label: t("financialDashboard"),
      icon: FinancialSvg,
      activeIcon: Financial1Svg,
    },
    {
      path: "/provider-refer-patient",
      label: t("referPatient"),
      icon: DashSvg3,
      activeIcon: DashSvg33,
    },
    {
      path: "/provider-setting/profile",
      label: t("settings"),
      icon: DashSvg5,
      activeIcon: DashSvg55,
      subLinks: [
        { path: "/provider-setting/profile", label: t("profileSetting") },
        { path: "/provider-setting/provider", label: t("providerSetting") },
        { path: "/provider-setting/payment", label: t("paymentSetting") },
        {
          path: "/provider-setting/change-password",
          label: t("changePassword"),
        },
      ],
    },
  ];

  return (
    <ul className="flex flex-col gap-3">
      <p className="text-lg px-4 font-semibold">
        {t("accountId", { dosespotId: data?.dosespotId || "N/A" })}
      </p>
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
                    onClick={() => {
                      // onClose();
                      setTitle(item?.label);
                      localStorage.setItem(
                        "title",
                        JSON.stringify(item?.label)
                      );
                    }}
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
  const { step, setStep } = useContext(MainContext)!;

  const toggleDrawer = () => {
    setStep(step === 1 ? 0 : 1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["clinician-profile"],
    queryFn: () => GetData("clinician/profile"),
  });

  return (
    <div>
      {/* Desktop View */}
      <div className="w-[350px] bg-white pl-10 h-screen xl:block hidden">
        <div>
          <div className="hidden lg:flex flex-col items-center justify-center pt-5">
            <img
              src={data?.avatar || imageProvider?.defaultImg}
              alt=""
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex flex-col items-center justify-center ">
              <p className="text-xl font-semibold">
                {data?.firstName || ""} {data?.lastName || ""}
              </p>
              <p>{data?.address1}</p>
              <p>
                {data?.city}, {data?.state}
              </p>
            </div>
          </div>
          <div className="pt-10">
            <NavItem />
          </div>

          {/* <hr className="mt-10 border border-[#F2F8FF] px-5" /> */}
          {/* <div className="flex gap-2 pl-5 pt-8">
            <LogoutSvg />
            <button
              onClick={() => {
                handleLogOut();
                navigate("/");
              }}
              className="text-textSecondary font-nerisLight hover:text-primaryColor hover:font-nerisSemiBold duration-300"
            >
              Log Out
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Drawer View */}
      <Drawer
        placement="left"
        closable={false}
        open={step === 1}
        onClose={toggleDrawer}
        width={360}
        style={{ padding: 0 }}
        className="no-padding-drawer"
        maskClosable={true}
      >
        <div className="!bg-white mt-5">
          <div className="flex justify-end px-5 ">
            <button onClick={toggleDrawer}>
              <CloseOutlined />
            </button>
          </div>
          <div className="lg:flex flex-col items-center justify-center pt-5">
            <img
              src={data?.avatar || imageProvider?.defaultImg}
              alt=""
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex flex-col items-center justify-center ">
              <p className="text-xl font-semibold">
                {data?.firstName || ""} {data?.lastName || ""}
              </p>
              <p>{data?.address1}</p>
              <p>
                {data?.city}, {data?.state}
              </p>
            </div>
          </div>

          {/* <div className="pl-10">
            <Link to="/">
              <img
                className="w-[180px] h-[42px]"
                src={imageProvider.logo}
                alt="App Logo"
              />
            </Link>
          </div> */}

          <div className="pl-10 flex  items-center gap-3  mt-5 md:hidden  border border-[#D9D9D9] rounded-2xl px-4 py-2 w-full max-w-[300px]">
            <SearchSvg />
            <input
              className="text-[#7B7B7B] w-full focus:outline-none bg-transparent"
              type="search"
              placeholder="Search anything here..."
              aria-label="Search"
            />
          </div>

          <div className="mt-10 pl-10">
            <NavItem onClose={toggleDrawer} />
          </div>

          <hr className="mt-10 border border-[#F2F8FF] mx-5" />

          {/* <div className="flex gap-2 pl-5 mt-8">
            <LogoutSvg />
            <button
              onClick={() => {
                toggleDrawer();
                handleLogOut();
                navigate("/");
              }}
              className="!text-textSecondary !font-nerisLight hover:!text-primaryColor hover:!font-nerisSemiBold !duration-300"
            >
              Log Out
            </button>
          </div> */}
        </div>
      </Drawer>
    </div>
  );
};
