import { useState } from "react";
import { Table, Tabs } from "antd";
import type { TabsProps } from "antd";
import { GetData } from "../../../../api/API";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { imageProvider } from "../../../../lib/imageProvider";
import { useTranslation } from "react-i18next";

const TableItem = () => {
  const { t } = useTranslation("providerdashboard");
  const [activeTab, setActiveTab] = useState("1");

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  // Use the status in the query
  const { data, isLoading, error } = useQuery({
    queryKey: ["financial"],
    queryFn: () => GetData(`payment/clinician/transactions`),
  });

  // Transform API data to match your table structure
  const dataSource =
    (data &&
      data?.transactions?.map((transaction: any, index: number) => ({
        // key: index.toString(),
        TxnReferenceID: `${transaction.stripePaymentId || "N/A"}`,
        PayerName: (
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                transaction.patient?.patientProfile?.avatar ||
                imageProvider?.TableProfile
              }
            />
            <p>
              {transaction?.patient?.patientProfile?.firstName || "Unknown"}{" "}
              {transaction?.patient?.patientProfile?.lastName || "Patient"}
            </p>
          </div>
        ),
        Date:
          new Date(
            transaction.date || transaction.date
          ).toLocaleDateString("en-GB") || "N/A",
        rxType: transaction.type || "N/A",
        Amount: "$" + transaction?.amount || "N/A",
        Status: transaction?.status || "N/A",
        Action: (
          <Link to={`/provider-details/${transaction.id}`}>
            <div className="text-nowrap underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
              {t("view_details")}
            </div>
          </Link>
        ),
      }))) ||
    [];

  const dataSource2 = [
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: <div className="text-nowrap">25-06-2025</div>,
      PayerName: <div className="text-nowrap"> Marie Walker</div>,
      Amount: "$400",
      Status: "In Progress",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Completed",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Cancelled",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: <div className="text-nowrap">25-06-2025</div>,
      PayerName: <div className="text-nowrap"> Marie Walker</div>,
      Amount: "$400",
      Status: "In Progress",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Completed",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Cancelled",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: <div className="text-nowrap">25-06-2025</div>,
      PayerName: <div className="text-nowrap"> Marie Walker</div>,
      Amount: "$400",
      Status: "In Progress",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Completed",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Cancelled",
    },
  ];
  const dataSource3 = [
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: <div className="text-nowrap">25-06-2025</div>,
      PayerName: <div className="text-nowrap"> Marie Walker</div>,
      Amount: "$400",
      Status: "In Progress",
    },
    {
      key: "1",
      RequestID: "#Rx 123",
      TxnReferenceID: "4TGU7OKPMLAF",
      Date: "25-06-2025",
      PayerName: "Marie Walker",
      Amount: "$400",
      Status: "Cancelled",
    },
  ];

  const columns = [
    {
      title: <div className="text-nowrap">{t("txn_reference_id")}</div>,
      dataIndex: "TxnReferenceID",
      key: "TxnReferenceID",
    },
    {
      title: t("date"),
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: <div className="text-nowrap">{t("rx_type")}</div>,
      dataIndex: "rxType",
      key: "rxType",
    },
    {
      title: <div className="text-nowrap">{t("payer_name")}</div>,
      dataIndex: "PayerName",
      key: "PayerName",
    },
    {
      title: t("amount"),
      dataIndex: "Amount",
      key: "Amount",
    },

    {
      title: t("status"),
      dataIndex: "Status",
      key: "Status",

      render: (transaction) => {
        console.log("status", transaction);
        if (transaction === "pending") {
          return (
            <div className="bg-[#DBECFF] border border-[#0052B4] rounded-md px-2 py-1 w-fit">
              <p className="text-[#0052B4] text-center text-nowrap">{t("pending")}</p>
            </div>
          );
        } else if (transaction == "succeeded") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1  w-fit">
              <p className="text-[#02A133] text-center text-nowrap">
                {t("completed")}
              </p>
            </div>
          );
        } else if (transaction == "refund") {
          return (
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 w-fit">
              <p className="text-[#D80027] text-center text-nowrap">{t("refund")}</p>
            </div>
          );
        } else {
          return (
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 w-fit">
              <p className="text-[#D80027] text-center text-nowrap">
                {t("cancelled")}
              </p>
            </div>
          );
        }
      },
    },
  ];

  const tabLabels = [
    {
      key: "1",
      label: <div className="text-xs sm:text-sm md:text-base"> </div>,
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
      label: <div className="text-xs sm:text-sm md:text-base"> </div>,
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
      key: "3",
      label: <div className="text-xs sm:text-sm md:text-base"></div>,
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
          `}
        ></p>
      </div>
    ),
  }));
  const activeContent = tabLabels.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="bg-white mt-10 rounded-xl sm:p-5 p-2 mb-10">
      <div className="flex justify-between">
        <p className="font-nerisSemiBold md:text-3xl sm:text-xl text-base mt-5">
          {t("overview")}
        </p>
        <>
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
          `}</style>

          <Tabs
            activeKey={activeTab}
            onChange={onChange}
            items={items}
            size="large"
            indicator={{ size: 0, align: "center" }}
            className="custom-tab-bar"
          />
        </>
      </div>
      <div>
        {activeTab === "1" ? (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            scroll={{ x: "400px" }}
          />
        ) : (
          activeContent
        )}
      </div>
    </div>
  );
};

export default TableItem;