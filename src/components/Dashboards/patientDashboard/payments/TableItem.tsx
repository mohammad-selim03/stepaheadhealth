import { Table } from "antd";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { imageProvider } from "../../../../lib/imageProvider";

const TableItem = ({ data }) => {
  const { t } = useTranslation("patientdashboard");
  const dataSource =
    (data &&
      data?.transactions?.map((transaction: any, index: number) => ({
        TransactionId: transaction?.stripePaymentId,
        Date: new Date(transaction.date).toLocaleDateString("en-GB") || "N/A",
        Amount: "$" + transaction?.amount,
        rxType: ` ${transaction.type || "N/A"}`,
        Status: transaction?.status,
        MedicalProvider: (
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                transaction.clinician?.clinicianProfile?.avatar ||
                imageProvider.TableProfile
              }
            />
            <p>
              {transaction.clinician?.clinicianProfile?.firstName || "Unknown"}{" "}
              {transaction.clinician?.clinicianProfile?.lastName || "Patient"}
            </p>
          </div>
        ),

        Type: transaction.prescriptionType || "N/A",

        // Action: (
        //   <Link to={`/provider-details/${transaction.id}`}>
        //     <div className="text-nowrap underline font-semibold cursor-pointer font-nerisSemiBold text-textPrimary">
        //       View Details
        //     </div>
        //   </Link>
        // ),
      }))) ||
    [];

  const columns = [
    {
      title: t("transactionId"),
      dataIndex: "TransactionId",
      key: "TransactionId",
    },
    { title: t("date"), dataIndex: "Date", key: "Date" },
    { title: t("rxType"), dataIndex: "rxType", key: "rxType" },
    { title: t("amount"), dataIndex: "Amount", key: "Amount" },
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
        } else if (prescription === "succeeded") {
          return (
            <div className="bg-[#E2FFEB] border border-[#02A133] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#02A133] text-center">{t("succeeded")}</p>
            </div>
          );
        } else if (prescription === "Pending") {
          return (
            <div className="bg-yellow-100/50 border border-yellow-500 rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-yellow-600 text-center">{t("pending")}</p>
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
            <div className="bg-[#FFEBEB] border border-[#D80027] rounded-md px-2 py-1 xl:w-2/3 text-nowrap w-fit">
              <p className="text-[#D80027] text-center">{t("na")}</p>
            </div>
          );
        }
      },
    },
    // { title: "Action", dataIndex: "Action", key: "Action", width: 150 },
  ];

  const rowClassName = (_record: any, index: number) => {
    return index % 2 === 0 ? "row-light-blue" : "row-light-gray";
  };

  return (
    <div className="bg-white mt-10 rounded-xl sm:p-5 p-2">
      <div className="overflow-x-auto">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowClassName={rowClassName}
          scroll={{ x: "650px" }}
        />
        <style>{`
        .row-light-blue { background-color: #F2F8FF; }
        .row-light-gray { background-color: #FCFCFC; }
      `}</style>
      </div>
    </div>
  );
};

export default TableItem;
