import { Table } from "antd";

import { imageProvider } from "../../../../lib/imageProvider";
import { Link } from "react-router";
import { GetData } from "../../../../api/API";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const TableItem = () => {
  const { t } = useTranslation("providerdashboard");
  // Use the status in the query
  const { data, isLoading, error } = useQuery({
    queryKey: ["prescription"],
    queryFn: () => GetData(`prescription`),
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
                prescription.patient?.patientProfile?.avatar ||
                imageProvider.TableProfile
              }
            />
            <p>
              {prescription.patient?.patientProfile?.firstName || "Unknown"}{" "}
              {prescription.patient?.patientProfile?.lastName || "Patient"}
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

  const columns = [
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
              <p className="text-[#E48C12] text-center text-nowrap">{t("pending")}</p>
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

  const rowClassName = (_record: any, index: number) => {
    return index % 2 === 0 ? "row-light-blue" : "row-light-gray";
  };

  return (
    <div>
      <p className="font-nerisSemiBold md:text-[32px] text-2xl bg-primaryColor text-white p-3 rounded-xl">
        {t("all_prescriptions")}
      </p>{" "}
      <div className="bg-white mt-10 rounded-xl sm:p-5 p-2">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <p className="font-nerisSemiBold md:text-2xl sm:text-xl text-base">
            {t("all_prescriptions")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            scroll={{ x: "1400px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TableItem;