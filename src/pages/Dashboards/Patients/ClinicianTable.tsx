import { Table } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetData, PostData } from "../../../api/API";
import { imageProvider } from "../../../lib/imageProvider";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/common/Loader";

const  ClinicianTable = ({ onClinicianSelect }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingClinicianId, setLoadingClinicianId] = useState(null);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);

      // Set appropriate page size based on screen size
      if (width < 768) {
        setPageSize(5);
      } else if (width >= 768 && width < 1024) {
        setPageSize(8);
      } else {
        setPageSize(10);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  // const queryClient = useQueryClient();
  // // Use the status in the query with pagination parameters
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["current-clinician", currentPage, pageSize],
  //   queryFn: () =>
  //     GetData(
  //       `patient/clinicians-in-patient-state/${userInfo?.id}?page=${currentPage}&limit=${pageSize}`
  //     ),
  // });
  // const AssignedClinician = useMutation({
  //   mutationKey: ["assigned-clinician"],
  //   mutationFn: (payload) => PostData("patient/assign-clinician", payload),
  //   onMutate: (payload) => {
  //     // Set loading state for specific clinician
  //     setLoadingClinicianId(payload.clinicianId);
  //   },
  //   onSuccess: (data) => {
  //     console.log("aaaa", data);
  //     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  //     const id = data?.assignedClinician;
  //     const modified = { ...userInfo, assignedClinicianId: id };
  //     localStorage.setItem("userInfo", JSON.parse(modified));
  //     // console.log("mod", modified);
  //     // Reset loading state
  //     setLoadingClinicianId(null);
  //     toast.success("Clinician successfully updated");
  //     queryClient.invalidateQueries({
  //       queryKey: ["current-clinician", "assigned-clinician"],
  //     });
  //     // Call parent callback to refetch current clinician immediately
  //     if (onClinicianSelect) {
  //       onClinicianSelect();
  //     }
  //   },
  //   onError: () => {
  //     // Reset loading state on error
  //     setLoadingClinicianId(null);
  //     toast.error("Clinician update failed");
  //   },
  // });

  // const chooseClinician = (id) => {
  //   const modifieddata = {
  //     patientId: userInfo?.id,
  //     clinicianId: id,
  //   };
  //   AssignedClinician.mutate(modifieddata);
  // };

  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo") || "null")
  );

  const queryClient = useQueryClient();
  // Use the status in the query with pagination parameters
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "current-clinician",
      currentPage,
      pageSize,
      userInfo?.assignedClinicianId,
    ], // Added assignedClinicianId as dependency
    queryFn: () =>
      GetData(
        `patient/clinicians-in-patient-state/${userInfo?.id}?page=${currentPage}&limit=${pageSize}`
      ),
  });

  const AssignedClinician = useMutation({
    mutationKey: ["assigned-clinician"],
    mutationFn: (payload) => PostData("patient/assign-clinician", payload),
    onMutate: (payload) => {
      // Set loading state for specific clinician
      setLoadingClinicianId(payload.clinicianId);
    },
    onSuccess: async (data) => {
      console.log("aaaa", data);
      const currentUserInfo = JSON.parse(
        localStorage.getItem("userInfo") || "null"
      );
      const assignedClinicianId = data?.assignedClinician;
      const modified = { ...currentUserInfo, assignedClinicianId };
      // Update localStorage first
      localStorage.setItem("userInfo", JSON.stringify(modified));
      setUserInfo(modified);

      window.location.reload();
      // Now fetch data with the new assignedClinicianId
      try {
        const clinicianData = await GetData(`clinician/${assignedClinicianId}`);
        console.log("Assigned clinician data:", clinicianData);

        // You can store this data in state or query cache if needed
        // setAssignedClinicianData(clinicianData);
      } catch (error) {
        console.error("Failed to fetch assigned clinician data:", error);
      }

      // Reset loading state
      setLoadingClinicianId(null);
      toast.success("Clinician successfully updated");

      // Invalidate queries to refetch with updated userInfo
      queryClient.invalidateQueries({
        queryKey: ["current-clinician"], // This will invalidate all current-clinician queries
      });
      queryClient.invalidateQueries({
        queryKey: ["assigned-clinician"],
      });

      // Force immediate refetch with new data
      queryClient.refetchQueries({
        queryKey: ["current-clinician"],
      });

      // Call parent callback to refetch current clinician immediately
      if (onClinicianSelect) {
        onClinicianSelect(assignedClinicianId);
      }
    },
    onError: () => {
      // Reset loading state on error
      setLoadingClinicianId(null);
      toast.error("Clinician update failed");
    },
  });

  const chooseClinician = (id) => {
    const modifieddata = {
      patientId: userInfo?.id,
      clinicianId: id,
    };
    AssignedClinician.mutate(modifieddata);
  };

  // Transform API data to match your table structure
  const dataSource =
    data?.clinicians?.map((clinician: any, index: number) => ({
      key: clinician.id || index.toString(),
      id: clinician.id, // Add id for tracking
      img: (
        <img
          src={clinician.avatar || imageProvider?.defaultImg}
          alt=""
          className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-full flex-shrink-0"
        />
      ),
      Name: (
        <div className="flex gap-2 items-center min-w-0">
          <p className="text-sm sm:text-base truncate">
            {clinician.firstName || "Unknown"}{" "}
            {clinician.lastName || "Clinician"}
          </p>
        </div>
      ),
      // Phone: (
      //   <div className="text-xs sm:text-sm text-gray-700">
      //     {clinician.primaryPhone || "N/A"}
      //   </div>
      // ),
      // Email: (
      //   <div className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none">
      //     {clinician.email || "N/A"}
      //   </div>
      // ),
      NewFee: (
        <div className="text-xs sm:text-sm font-medium">
          ${clinician.prescriptionCharges?.newPrescriptionFee || "N/A"}
        </div>
      ),
      RefillFee: (
        <div className="text-xs sm:text-sm font-medium">
          ${clinician.prescriptionCharges?.refillPrescriptionFee || "N/A"}
        </div>
      ),
      Action: (
        <button
          onClick={() => chooseClinician(clinician?.id)}
          disabled={loadingClinicianId === clinician.id}
          className="text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 rounded-md font-semibold cursor-pointer font-nerisSemiBold text-white bg-primaryColor w-full min-w-[80px] sm:min-w-[120px] hover:bg-opacity-90 transition-colors"
        >
          {/* {isMobile ? "Choose" : "Choose Clinician"} */}
          {loadingClinicianId === clinician.id ? (
            <Loader />
          ) : (
            <> Choose Clinician</>
          )}
        </button>
      ),
      // Mobile card data
      mobileData: {
        name: `${clinician.firstName || "Unknown"} ${
          clinician.lastName || "Clinician"
        }`,
        // phone: clinician.primaryPhone || "N/A",
        // email: clinician.email || "N/A",
        newFee: clinician.prescriptionCharges?.newPrescriptionFee
          ? `$${clinician.prescriptionCharges.newPrescriptionFee}`
          : "N/A",
        refillFee: clinician.prescriptionCharges?.refillPrescriptionFee
          ? `$${clinician.prescriptionCharges.refillPrescriptionFee}`
          : "N/A",
        avatar: clinician.avatar || imageProvider?.defaultImg,
      },
    })) || [];

  // Mobile card component
  const MobileCard = ({ item, index }: { item: any; index: number }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={item.mobileData.avatar}
          alt=""
          className="w-10 h-10 object-cover rounded-full flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base text-gray-900 truncate">
            {item.mobileData.name}
          </h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {/* <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Phone:</span>
          <span className="text-sm font-medium text-gray-900">
            {item.mobileData.phone}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Email:</span>
          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
            {item.mobileData.email}
          </span>
        </div> */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">New Fee:</span>
          <span className="text-sm font-medium text-gray-900">
            {item.mobileData.newFee}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Refill Fee:</span>
          <span className="text-sm font-medium text-gray-900">
            {item.mobileData.refillFee}
          </span>
        </div>
      </div>

      <button
        onClick={() => chooseClinician(item?.id)}
        disabled={loadingClinicianId === item.id}
        className="w-full py-3 rounded-md font-semibold cursor-pointer font-nerisSemiBold text-white bg-primaryColor hover:bg-opacity-90 transition-colors text-sm md:text-base"
      >
        {loadingClinicianId === item.id ? <Loader /> : <> Choose Clinician</>}
      </button>
    </div>
  );

  // Desktop/Tablet columns configuration
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Image",
        dataIndex: "img",
        key: "img",
        width: isMobile ? 20 : isTablet ? 20 : 20,
        fixed: false,
      },
      {
        title: "Name",
        dataIndex: "Name",
        key: "Name",
        width: isMobile ? 40 : isTablet ? 30 : 40,
        ellipsis: true,
      },
    ];

    // Add conditional columns based on screen size
    // if (!isMobile) {
    //   baseColumns.push(
    //     {
    //       title: "Phone",
    //       dataIndex: "Phone",
    //       key: "Phone",
    //       width: isTablet ? 30 : 40,
    //       ellipsis: true,
    //     },
    //     {
    //       title: "Email",
    //       dataIndex: "Email",
    //       key: "Email",
    //       width: isTablet ? 50 : 60,
    //       ellipsis: true,
    //     }
    //   );
    // }

    if (!isMobile && !isTablet) {
      baseColumns.push(
        {
          title: "New Fee",
          dataIndex: "NewFee",
          key: "NewFee",
          width: 40,
        },
        {
          title: "Refill Fee",
          dataIndex: "RefillFee",
          key: "RefillFee",
          width: 40,
        }
      );
    }

    baseColumns.push({
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      width: isMobile ? 40 : isTablet ? 40 : 40,
      fixed: isMobile ? "right" : false,
    });

    return baseColumns;
  };

  const rowClassName = (_record: any, index: number) => {
    return index % 2 === 0 ? "row-light-blue" : "row-light-gray";
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white mt-10 rounded-xl p-5">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white mt-10 rounded-xl p-5">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden -ml-0">
      <div className="bg-white mt-10 rounded-xl p-2 sm:p-5">
        {isMobile ? (
          // Mobile card layout
          <div className="space-y-0">
            <h2 className="text-lg font-semibold mb-4 px-2">Clinicians</h2>
            {dataSource.length > 0 ? (
              <div className="px-2">
                {dataSource.map((item, index) => (
                  <MobileCard key={item.key} item={item} index={index} />
                ))}
                {/* Mobile pagination */}
                {data?.data?.pagination &&
                  data.data.pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 py-4">
                      <button
                        onClick={() =>
                          handlePaginationChange(currentPage - 1, pageSize)
                        }
                        disabled={!data.data.pagination.hasPrevPage}
                        className="px-3 py-1 rounded text-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {data.data.pagination.currentPage} of{" "}
                        {data.data.pagination.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          handlePaginationChange(currentPage + 1, pageSize)
                        }
                        disabled={!data.data.pagination.hasNextPage}
                        className="px-3 py-1 rounded text-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8 px-2">
                <p className="text-gray-500">No clinicians available</p>
              </div>
            )}
          </div>
        ) : (
          // Desktop/Tablet table layout
          <div className="w-full">
            <div className="overflow-x-auto">
              <Table
                dataSource={dataSource}
                columns={getColumns()}
                rowClassName={rowClassName}
                scroll={{
                  x: isTablet ? 800 : 980,
                  y: window.innerHeight > 800 ? 500 : 400,
                }}
                pagination={{
                  current: data?.data?.pagination?.currentPage || 1,
                  total: data?.data?.pagination?.totalItems || 0,
                  pageSize: data?.data?.pagination?.itemsPerPage || pageSize,
                  showSizeChanger: !isMobile,
                  showQuickJumper: !isMobile && !isTablet,
                  showTotal: (total, range) =>
                    isMobile
                      ? `${range[0]}-${range[1]} of ${total}`
                      : `${range[0]}-${range[1]} of ${total} items`,
                  size: isMobile ? "small" : "default",
                  onChange: handlePaginationChange,
                  onShowSizeChange: handlePaginationChange,
                }}
                size={isMobile ? "small" : isTablet ? "middle" : "default"}
                className="responsive-table"
              />
            </div>
          </div>
        )}
      </div>

      {/* Custom responsive styles */}
      <style jsx global>{`
        .responsive-table .ant-table-thead > tr > th {
          padding: ${isMobile
            ? "8px 4px"
            : isTablet
            ? "12px 8px"
            : "16px 16px"};
          font-size: ${isMobile ? "12px" : isTablet ? "13px" : "14px"};
          font-weight: 600;
        }

        .responsive-table .ant-table-tbody > tr > td {
          padding: ${isMobile ? "8px 4px" : isTablet ? "12px 8px" : "8px 8px"};
          border-bottom: 1px solid #f0f0f0;
        }

        .responsive-table .ant-table-tbody > tr:hover > td {
          background: #f5f5f5;
        }

        .row-light-blue {
          background-color: #fafbff;
        }

        .row-light-gray {
          background-color: #fafafa;
        }

        @media (max-width: 640px) {
          .responsive-table .ant-table-container {
            border-radius: 8px;
          }

          .responsive-table .ant-pagination {
            margin: 16px 0 0 0;
            text-align: center;
          }

          .responsive-table .ant-pagination-options {
            display: none;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .responsive-table .ant-table-pagination {
            margin: 20px 0 0 0;
          }
        }

        @media (min-width: 1025px) {
          .responsive-table .ant-table-pagination {
            margin: 24px 0 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ClinicianTable;
