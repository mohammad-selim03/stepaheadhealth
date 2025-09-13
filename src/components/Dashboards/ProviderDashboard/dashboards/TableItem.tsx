import { useState } from "react";
import { Table, Tabs } from "antd";
import type { TabsProps } from "antd";
import { imageProvider } from "../../../../lib/imageProvider";
import { Link } from "react-router";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { useTranslation } from "react-i18next";

const TableItem = () => {
  const { t } = useTranslation("providerdashboard");
  const [activeTab, setActiveTab] = useState("1");

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  // Define the status based on the active tab
  const getStatusByTab = (tabKey: string) => {
    switch (tabKey) {
      case "1":
        return "";
      case "2":
        return "Pending";
      case "3":
        return "";
      case "4":
        return "Approved";
      case "5":
        return "Completed";
      case "6":
        return "Rejected";
      default:
        return "N/A";
    }
  };
  // Use the status in the query
  const { data, isLoading, error } = useQuery({
    queryKey: ["prescription", activeTab],
    queryFn: () => {
      // Build query parameters object
      const queryParams: Record<string, string> = {};

      // Only add prescriptionType if activeTab is 1 or 2 (or whatever your logic is)
      if (activeTab === "2") {
        queryParams.prescriptionStatus = "Pending";
      }
      //  else if (activeTab === "2") {
      //   queryParams.prescriptionType = "Refill";
      // }

      // Only add status if getStatusByTab returns a value
      const status = getStatusByTab(activeTab);
      if (status) {
        queryParams.status = status;
      }

      // Convert to query string
      const queryString = new URLSearchParams(queryParams).toString();

      return GetData(`prescription${queryString ? `?${queryString}` : ""}`);
    },
  });

  // Transform API data to match your table structure
  const dataSource =
    (data &&
      data?.prescriptions?.map((prescription: any, index: number) => ({
        key: index.toString(),
        RxID: `#Rx ${prescription.rxId || prescription.rxId || index}`,
        PatientName: (
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                prescription?.patient?.patientProfile?.avatar ||
                imageProvider?.defaultImg
              }
            />
            <p>
              {prescription?.patient?.patientProfile?.firstName || "N/"}{" "}
              {prescription?.patient?.patientProfile?.lastName || "A"}
            </p>
          </div>
        ),
        Date:
          new Date(
            prescription.createdAt || prescription.createdAt
          ).toLocaleDateString("en-GB") || "N/A",
        Type: prescription.prescriptionType || "N/A",
        Status: prescription?.prescriptionStatus || "N/A",
        Action: (
          <Link to={`/provider-details/${prescription.id}`}>
            <div className="text-nowrap underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
              {t("view_details")}
            </div>
          </Link>
        ),
      }))) ||
    [];

  const dataSource1 = [
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "In Progress",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Completed",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "In Progress",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
  ];
  const dataSource2 = [
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "In Progress",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Completed",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },

    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Cancelled",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Completed",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
  ];
  const dataSource3 = [
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "In Progress",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Completed",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
    {
      key: "1",
      RxID: "#Rx 123",
      PatientName: (
        <div className=" flex gap-2 items-center">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={imageProvider.TableProfile}
          />
          <p> Marie Walker</p>
        </div>
      ),
      Date: "25-06-2025",
      Type: "Refill",

      Status: "Cancelled",
      Action: (
        <Link to="/provider-details">
          <div className=" underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
            {t("view_details")}
          </div>
        </Link>
      ),
    },
  ];

  const columns: TableColumnsType = [
    {
      title: t("rx_id"),
      dataIndex: "RxID",
      key: "RxID",
    },
    {
      title: t("patient_name"),
      dataIndex: "PatientName",
      key: "PatientName",
    },
    {
      title: t("date"),
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: t("type"),
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: t("status"),
      dataIndex: "Status",
      key: "Status",

      render: (prescriptionStatus) => {
        if (prescriptionStatus === "In Progress") {
          return (
            <div className="bg-[#DBECFF] border border-[#0052B4] rounded-md px-2 py-1 w-fit">
              <p className="text-[#0052B4] text-center text-nowrap">
                {t("in_progress")}
              </p>
            </div>
          );
        } else if (prescriptionStatus === "Approved") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1  w-fit">
              <p className="text-[#02A133] text-center text-nowrap">
                {t("in_progress")}
              </p>
            </div>
          );
        } else if (prescriptionStatus === "Completed") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1  w-fit">
              <p className="text-[#02A133] text-center text-nowrap">
                {t("completed")}
              </p>
            </div>
          );
        } else if (prescriptionStatus === "Pending") {
          return (
            <div className="bg-[#FFF1DD] border border-[#D09440] rounded-md px-2 py-1  w-fit">
              <p className="text-[#E48C12] text-center text-nowrap">
                {t("pending")}
              </p>
            </div>
          );
        } else {
          return (
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 w-fit">
              <p className="text-[#D80027] text-center text-nowrap">
                {prescriptionStatus}
              </p>
            </div>
          );
        }
      },
    },
    {
      title: t("action"),
      dataIndex: "Action",
      key: "Action",
    },
  ];

  const tabLabels = [
    {
      key: "1",
      label: <div className="text-xs sm:text-sm md:text-base">{t("all")}</div>,
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: "1400px" }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="text-xs sm:text-sm md:text-base">
          {t("new_request")}{" "}
        </div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: "1400px" }}
          />
        </div>
      ),
    },
    // {
    //   key: "3",
    //   label: (
    //     <div className="text-xs sm:text-sm md:text-base">New Refills </div>
    //   ),
    //   content: (
    //     <div className="overflow-x-auto">
    //       <Table
    //         dataSource={dataSource}
    //         columns={columns}
    //         scroll={{ x: "1400px" }}
    //       />
    //     </div>
    //   ),
    // },
    {
      key: "4",
      label: (
        <div className="text-xs sm:text-sm md:text-base">
          {t("in_progress")}
        </div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource1}
            columns={columns}
            scroll={{ x: "1400px" }}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <div className="text-xs sm:text-sm md:text-base">{t("completed")}</div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource2}
            columns={columns}
            scroll={{ x: "1400px" }}
          />
        </div>
      ),
    },
    {
      key: "6",
      label: (
        <div className="text-xs sm:text-sm md:text-base">{t("cancel")}</div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource3}
            columns={columns}
            scroll={{ x: "1400px" }}
          />
        </div>
      ),
    },
  ];

  const rowClassName = (_record: any, index: number) => {
    return index % 2 === 0 ? "row-light-blue" : "row-light-gray";
  };
  const items: TabsProps["items"] = tabLabels.map((tab) => ({
    key: tab.key,
    label: (
      <div>
        <p
          className={`text-[#5A5C5F] font-Poppins font-light rounded-xl px-5 py-2 cursor-pointer transition-colors duration-300
            ${
              activeTab === tab.key
                ? "bg-primaryColor text-white"
                : "bg-[#F2F8FF] hover:bg-primaryColor hover:text-white"
            }
          `}
        >
          {tab.label}
        </p>
      </div>
    ),
  }));
  // const activeContent = tabLabels.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="bg-white mt-10 rounded-xl sm:p-5 p-2 mb-10">
      <div className="flex flex-wrap justify-between">
        <p className="font-nerisSemiBold md:text-2xl sm:text-xl text-base mt-5">
          {t("overview")}
        </p>
        <div>
          <style>{`
            .custom-tab-bar .ant-tabs-nav::before {
              border-bottom: none !important;
            }
            .row-light-blue {
              background-color: #F2F8FF;
            }
            .row-light-gray {
              background-color: #FCFCFC;
            }
              @media (max-width:720px) {
      .custom-tab-bar .ant-tabs-nav .ant-tabs-nav-list {
        flex-direction: column !important;
      }
      .custom-tab-bar .ant-tabs-tab {
      justify-content: end !important;

      }
    }
          `}</style>

          <Tabs
            activeKey={activeTab}
            onChange={onChange}
            items={items}
            size="large"
            indicator={{ size: 0, align: "center" }}
            className="custom-tab-bar"
          />
        </div>
      </div>
      <div>
        {error && (
          <div className="text-red-500 p-4">
            {t("something_went_wrong")}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <span className="h-96 flex items-center justify-center">
              <Loader color="#000000" />
            </span>
          </div>
        ) : (
          <div>
            <Table
              dataSource={dataSource}
              columns={columns}
              rowClassName={rowClassName}
              scroll={{ x: "800px" }}
              loading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableItem;
