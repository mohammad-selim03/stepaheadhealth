import type { CollapseProps } from "antd";
import { Collapse, DatePicker, Pagination } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import { useContext, useState } from "react";
import { MainContext } from "../../../provider/ContextProvider";
import { ArrowIcon } from "../../../components/Generals/Home/HomeIcons";

const PrescriptionLog = () => {
  const { id } = useContext(MainContext);

  // State for date range - default to past month and current month end
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "prescription-log",
      dateRange.startDate,
      dateRange.endDate,
      currentPage,
    ],
    queryFn: () =>
      GetData(
        `prescription/log/${id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&pageNumber=${currentPage}`
      ),
    enabled: !!id, // Only run query when id is available
  });

  const handleDateChange = (date: any, type: "start" | "end") => {
    if (date) {
      const formattedDate = moment(date).format("MM-DD-YYYY");
      setDateRange((prev) => ({
        ...prev,
        [type === "start" ? "startDate" : "endDate"]: formattedDate,
      }));
      // Reset to first page when date changes
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  // Generate collapse items from API data
  const generateCollapseItems = (prescription: any): CollapseProps["items"] => [
    {
      key: prescription.PrescriptionId.toString(),
      label: (
        <p className="text-xl font-semibold">{prescription.DisplayName}</p>
      ),
      children: (
        <div className="space-y-2">
          <p>
            <strong>Directions:</strong> {prescription.Directions}
          </p>
          <p>
            <strong>Quantity:</strong> {prescription.Quantity}
          </p>
          <p>
            <strong>Refills:</strong> {prescription.Refills}
          </p>
          <p>
            <strong>Days Supply:</strong> {prescription.DaysSupply}
          </p>
          <p>
            <strong>Pharmacy Notes:</strong>{" "}
            {prescription.PharmacyNotes || "None"}
          </p>
          <p>
            <strong>No Substitutions:</strong>{" "}
            {prescription.NoSubstitutions ? "Yes" : "No"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <p className="text-3xl font-semibold">Prescription Log</p>
      <div className="bg-white p-4 rounded-2xl h-[350px] md:h-[450px] lg:h-[700px] overflow-y-auto">
        <div className="bg-[#F2F8FF] p-5 rounded-xl">
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">From:</span>
              <DatePicker
                placeholder="Select date"
                defaultValue={moment().subtract(1, "month").startOf("month")}
                onChange={(date) => handleDateChange(date, "start")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">To:</span>
              <DatePicker
                placeholder="Select date"
                defaultValue={moment().endOf("month")}
                onChange={(date) => handleDateChange(date, "end")}
              />
            </div>
          </div>
          {/* table */}
          <div className="bg-white mt-4 border border-gray-200 rounded-lg overflow-hidden">
            {/* Header Row */}
            <div className="flex w-full border-b border-gray-200 bg-gray-50">
              <div className="text-xl font-semibold w-60 p-5 border-r border-gray-200">
                Status
              </div>
              <div className="text-xl font-semibold w-sm p-5 border-r border-gray-200">
                Date (UTC)
              </div>
              <div className="text-xl font-semibold flex-1 p-5">
                Additional Notes
              </div>
            </div>
            {/* Data Rows */}
            {isLoading ? (
              <div className="flex w-full min-h-0">
                <div className="text-textSecondary font-semibold text-lg w-60 p-5 border-r border-gray-200 flex items-start">
                  Loading...
                </div>
                <div className="text-xl font-semibold w-sm p-5 border-r border-gray-200 flex items-start">
                  -
                </div>
                <div className="flex-1 p-5">Loading prescription data...</div>
              </div>
            ) : error ? (
              <div className="flex w-full min-h-0">
                <div className="text-textSecondary font-semibold text-lg w-60 p-5 border-r border-gray-200 flex items-start">
                  Error
                </div>
                <div className="text-xl font-semibold w-sm p-5 border-r border-gray-200 flex items-start">
                  -
                </div>
                <div className="flex-1 p-5">
                  Error loading prescription data
                </div>
              </div>
            ) : data?.Items?.length > 0 ? (
              data?.Items?.map((prescription: any) => (
                <div
                  key={prescription.PrescriptionId}
                  className="flex w-full min-h-0 border-b border-gray-200 last:border-b-0"
                >
                  <div className="text-textSecondary font-semibold text-lg w-60 p-5 border-r border-gray-200 flex items-start">
                    {prescription.Status}
                  </div>
                  <div className="text-xl font-semibold w-sm p-5 border-r border-gray-200 flex items-start">
                    {moment(prescription.WrittenDate).format(
                      "MMM DD, YYYY, h:mm A"
                    )}
                  </div>
                  <div className="flex-1 p-0">
                    <Collapse
                      items={generateCollapseItems(prescription)}
                      onChange={onChange}
                      expandIcon={({ isActive }) => (
                        <ArrowIcon rotate={isActive ? 180 : 0} />
                      )}
                      expandIconPosition="end"
                      ghost
                      style={{
                        background: "transparent",
                      }}
                      className="h-full [&_.ant-collapse-item]:!border-none [&_.ant-collapse-header]:!border-none [&_.ant-collapse-content]:!border-none [&_.ant-collapse-header]:!p-5 [&_.ant-collapse-content-box]:!px-5 [&_.ant-collapse-content-box]:!pb-5 [&_.ant-collapse-content-box]:!pt-0"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex w-full min-h-0">
                <div className="text-textSecondary font-semibold text-lg w-60 p-5 border-r border-gray-200 flex items-start">
                  No Data
                </div>
                <div className="text-xl font-semibold w-sm p-5 border-r border-gray-200 flex items-start">
                  -
                </div>
                <div className="flex-1 p-5">
                  No prescription data found for the selected date range
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data?.data?.PageResult && data.data.PageResult.TotalCount > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={data.data.PageResult.TotalCount}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionLog;