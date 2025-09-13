import { useState } from "react";
import { Table, Tabs } from "antd";
import type { TabsProps } from "antd";
import { imageProvider } from "../../../../lib/imageProvider";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GetData } from "../../../../api/API";

const TableItem = () => {
  const { t } = useTranslation("patientdashboard");
  const [activeTab, setActiveTab] = useState("1");

  const onChange = (key: string) => setActiveTab(key);

  // Define the status based on the active tab
  const getStatusByTab = (tabKey: string) => {
    switch (tabKey) {
      case "1":
        return "";
      case "2":
        return "";
      case "3":
        return "";
      case "4":
        return "Completed";
      case "5":
        return "Rejected";
      default:
        return "N/A";
    }
  };
  // Use the status in the query
  const { data } = useQuery({
    queryKey: ["prescription", activeTab],
    queryFn: () => {
      const queryParams: Record<string, string> = {};

      if (activeTab === "2") {
        queryParams.prescriptionStatus = "Pending";
      } else if (activeTab === "3") {
        queryParams.prescriptionType = "Refill";
      }

      const status = getStatusByTab(activeTab);
      if (status) {
        queryParams.status = status;
      }

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
        MedicalProvider: (
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                prescription.clinician?.clinicianProfile?.avatar ||
                imageProvider.defaultImg
              }
            />
            <p>
              {prescription?.clinician?.clinicianProfile?.firstName ||
                "Unknown"}{" "}
              {prescription?.clinician?.clinicianProfile?.lastName || "Patient"}
            </p>
          </div>
        ),
        Date:
          new Date(
            prescription.createdAt || prescription.createdAt
          ).toLocaleDateString("en-GB") || "N/A",
        Type: prescription.prescriptionType || "N/A",
        // MedicalProvider:
        //   prescription?.clinician?.clinicianProfile?.firstName +
        //     " " +
        //     prescription?.clinician?.clinicianProfile?.lastName || "N/A",
        Status: prescription?.prescriptionStatus || "N/A",
        Action: (
          <Link to={`/patient-details/${prescription?.id}`}>
            <div className="text-nowrap underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
              {t("viewDetails")}
            </div>
          </Link>
        ),
      }))) ||
    [];

  const columns = [
    {
      title: t("rxId"),
      dataIndex: "RxID",
      key: "RxID",
    },

    {
      title: t("date"),
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: t("medicalProvider"),
      dataIndex: "MedicalProvider",
      key: "MedicalProvider",
    },
    {
      title: t("status"),
      dataIndex: "Status",
      key: "Status",

      render: (prescription) => {
        console.log("trans", prescription);
        if (prescription === "In Progress") {
          return (
            <div className="bg-[#DBECFF] border border-[#0052B4] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#0052B4] text-center">{t("inProgress")}</p>
            </div>
          );
        } else if (prescription === "Completed") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#02A133] text-center">{t("completed")}</p>
            </div>
          );
        } else if (prescription === "Approved") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#02A133] text-center">{t("approved")}</p>
            </div>
          );
        } else if (prescription === "Pending") {
          return (
            <div className="bg-yellow-100/50 border border-yellow-500 rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-yellow-600 text-center">{t("pending")}</p>
            </div>
          );
        } else if (prescription == "Unpaid") {
          return (
            <div className="bg-yellow-100/50 border border-yellow-500 rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-yellow-600 text-center">{t("unpaid")}</p>
            </div>
          );
        } else if (prescription == "Rejected") {
          return (
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#D80027] text-center">{t("rejected")}</p>
            </div>
          );
        } else if (prescription === "Cancel") {
          return (
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#D80027] text-center">{t("canceled")}</p>
            </div>
          );
        } else {
          return (
            <div className="bg-[#FFEBEB] border border-gary-400 rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-gray-600 text-center">{t("na")}</p>
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

  const rowClassName = (_record: any, index: number) =>
    index % 2 === 0 ? "row-light-blue" : "row-light-gray";

  const tabLabels = [
    {
      key: "1",
      label: <div className="text-xs sm:text-sm md:text-base">{t("all")}</div>,
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            scroll={{ x: "700px" }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="text-xs sm:text-sm md:text-base">
          {" "}
          {t("newRxRequest")}{" "}
        </div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            scroll={{ x: "800px" }}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="text-xs sm:text-sm md:text-base">
          {" "}
          {t("rxRefillsRequests")}{" "}
        </div>
      ),
      content: (
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            scroll={{ x: "800px" }}
          />
        </div>
      ),
    },
    // {
    //   key: "3",
    //   label: (
    //     <div className="text-xs sm:text-sm md:text-base"> Appointments </div>
    //   ),
    //   content: (
    //     <div className="overflow-x-auto">
    //       <Table
    //         dataSource={dataSource2}
    //         columns={columns}
    //         rowClassName={rowClassName}
    //         scroll={{ x: "1400px" }}
    //       />
    //     </div>
    //   ),
    // },
  ];

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

  const activeContent = tabLabels.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="bg-white mt-10 rounded-xl md:p-5 p-2">
      <div className=" flex justify-between">
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
      <div>{activeContent}</div>
    </div>
  );
};

export default TableItem;
