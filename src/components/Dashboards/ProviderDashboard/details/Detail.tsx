import { Button, Modal } from "antd";
import { imageProvider } from "../../../../lib/imageProvider";
import {
  ChatIcon,
  EditIcon,
  PresciptionLogIcon,
} from "../../../Generals/Home/HomeIcons";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import moment from "moment";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import AddMedicineModal from "./AddMedicineModal";
import { MainContext } from "../../../../provider/ContextProvider";
import { cn } from "../../../../lib/utils";

type PatientProfile = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address1?: string;
  city?: string;
  state?: string;
};

type Medication = {
  displayName: string;
};

type PrescriptionDetails = {
  prescriptionStatus?: string;
  prescriptionType?: string;
  patient?: {
    patientProfile?: PatientProfile;
  };
  medications?: Medication[];
  healthConditionsAndSymptoms?: string;
  pastMedicalConditionsHistory?: string;
  currentMedication?: string;
  reasonforMedication?: string;
  allergies?: string;
};

const Detail = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  // get prescription details
  const { data, isLoading, error } = useQuery<PrescriptionDetails>({
    queryKey: ["prescription-details"],
    queryFn: () => GetData(`/prescription/${id}`),
  });

  const queryClient = useQueryClient();
  // handle status
  const HandleStatus = useMutation({
    mutationKey: ["handleStatus"],
    mutationFn: (payload: { id: number }) =>
      PostData(`prescription/${id}/status`, payload, "patch"),
    onSuccess: () => {
      toast.success("Prescription added successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription-details"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Error while changing status"
      );
    },
  });

  const [confirmPharmacy, setConfirmPharmacy] = useState(false);
  // Send medicine to the pharmacy
  const SendToPharmacy = useMutation({
    mutationKey: ["sendToPharmacy"],
    mutationFn: () => PostData(`prescription/${id}/send-prescription`),
    onSuccess: (data) => {
      toast.success(
        data?.response?.data?.message || "Prescription Send to the pharmacy.!"
      );
      setConfirmPharmacy(true);
      queryClient.invalidateQueries({ queryKey: ["prescription-details"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Something went wrong, try again."
      );
    },
  });

  const handleSendToPharmacy = () => {
    SendToPharmacy.mutate();
  };
  const { setId } = useContext(MainContext);
  setId(data?.patient?.patientProfile?.dosespotId);

  // const handleDownload = async (
  //   e: React.MouseEvent,
  //   url: string,
  //   filename: string
  // ) => {
  //   e.preventDefault();
  //   e.stopPropagation(); // Prevent any parent click events

  //   try {
  //     // For Cloudinary URLs, use fetch to get the file
  //     const response = await fetch(url);

  //     if (!response.ok) {
  //       throw new Error("Failed to download file");
  //     }

  //     // Get the content type from response headers
  //     const contentType = response.headers.get("content-type") || "image/jpeg";
  //     const blob = await response.blob();

  //     // Create a proper blob with correct MIME type
  //     const fileBlob = new Blob([blob], { type: contentType });
  //     const downloadUrl = window.URL.createObjectURL(fileBlob);

  //     const link = document.createElement("a");
  //     link.href = downloadUrl;

  //     // Ensure the filename has proper extension
  //     let finalFilename = filename || "download";
  //     if (!finalFilename.includes(".")) {
  //       // Add appropriate extension based on content type
  //       const extension = contentType.split("/")[1] || "jpg";
  //       finalFilename = `${finalFilename}.${extension}`;
  //     }

  //     link.download = finalFilename;
  //     link.style.display = "none";

  //     document.body.appendChild(link);
  //     link.click();

  //     // Clean up
  //     setTimeout(() => {
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(downloadUrl);
  //     }, 100);
  //   } catch (error) {
  //     console.error("Download failed:", error);

  //     // Fallback: use Cloudinary's built-in download feature
  //     const downloadUrl = `${url}?dl=${filename || "prescription-image.jpg"}`;
  //     window.open(downloadUrl, "_blank");
  //   }
  // };
  const handleDownload = async (
    e: React.MouseEvent,
    documentUrl: string | undefined,
    fileName: string
  ) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any parent event handlers

    if (!documentUrl) {
      alert("No document URL provided. Please try again.");
      return;
    }

    try {
      // Validate URL
      new URL(documentUrl);

      // Fetch the file as a Blob with no-cache to avoid redirects
      const response = await fetch(documentUrl, {
        method: "GET",
        headers: {
          Accept: "application/octet-stream",
          "Cache-Control": "no-cache",
        },
        mode: "cors", // Ensure CORS is handled
        credentials: "same-origin", // Adjust if authentication is needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get file name from response headers or fallback
      const contentDisposition = response.headers.get("content-disposition");
      let finalFileName = fileName || "downloaded-file";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches && matches[1]) {
          finalFileName = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Download error:", error);
      alert(
        "Failed to download the file. Please check the URL or try again later."
      );
    }
  };

  interface DownloadComponentProps {
    data: {
      documents?: string;
      fileName?: string;
    };
  }

  const DownloadComponent: React.FC<DownloadComponentProps> = ({ data }) => {
    return (
      <div className="flex items-center justify-between w-full">
        <button
          onClick={(e) =>
            handleDownload(
              e,
              data?.documents,
              data?.fileName || "prescription-image.jpg"
            )
          }
          className="flex items-center justify-between w-full p-2 rounded text-textPrimary font-nerisSemiBold sm:text-base text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Download prescription file"
        >
          <span>File</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    );
  };

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </div>
  ) : error ? (
    <div className="flex items-center justify-center h-screen">
      Something went wrong, try again.
    </div>
  ) : (
    <div>
      <div className="flex sm:items-center items-start justify-between mb-10 pr-5">
        <p className="text-textPrimary font-nerisSemiBold  text-[32px] ">
          Details
        </p>

        <div className=" flex flex-col sm:flex-row gap-3">
          <Link to={"/provider-messages"}>
            <Button className="!bg-primaryColor !h-10 !rounded-xl !text-white !font-nerisSemiBold  hover:!scale-105 !transition-all !duration-300 !px-5">
              <ChatIcon />
              Chat with Patient
            </Button>
          </Link>
          {data?.prescriptionStatus == "Pending" && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => HandleStatus.mutate({ status: "Approved" })}
                className="!bg-[#E2FFEB] !h-10 !rounded-xl !text-[#02A133] !border !border-[#02A133] !flex !items-center !justify-center !font-nerisSemiBold !px-5 hover:!scale-105 !transition-all !duration-300"
              >
                {HandleStatus.isPending ? (
                  <p>
                    <Loader color="#000000" />
                  </p>
                ) : (
                  <>Approve Request</>
                )}
              </Button>

              <Button
                onClick={() => HandleStatus.mutate({ status: "Rejected" })}
                className="!bg-white !h-10 !rounded-xl !font-nerisSemiBold  !border !border-[#D80027] !text-[#D80027]   hover:!outline-none !transition-all !px-5 !duration-300 hover:!scale-105"
              >
                Cancel Request
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <p className="text-textPrimary font-nerisSemiBold md:text-2xl sm:text-xl text-base">
          RX Requested ID: 12
        </p>

        <div>
          {" "}
          <div className="flex items-center justify-between">
            <p className="text-textPrimary font-nerisSemiBold sm:text-lg text-xl py-8">
              Patient Information
            </p>
            <div className=" flex flex-col sm:flex-row gap-3">
              <Link to={"/prescription-log"}>
                <Button className="!bg-white !h-10 !rounded-xl !text-primaryColor !font-nerisSemiBold !border !border-primaryColor hover:!scale-105 !transition-all !duration-300 !px-5">
                  <PresciptionLogIcon />
                  Prescription History
                </Button>
              </Link>
              {(data?.prescriptionType == "New" ||
                data?.prescriptionType == "Refill") &&
                data?.prescriptionStatus !== "Completed" && (
                  <Button
                    onClick={() => setOpen(!open)}
                    className="!bg-white !px-5 !h-10 !rounded-xl !text-primary !text-primaryColor !font-nerisSemiBold  hover:!scale-105 !transition-all !duration-300 "
                  >
                    <EditIcon id={id} />{" "}
                    {data?.medications?.length && data?.medications?.length > 0
                      ? "Edit"
                      : "Add"}{" "}
                    Medication
                  </Button>
                )}
              {/* {data?.prescriptionStatus !== "Completed" && (
                <Button className="!bg-white !px-5 !h-10 !rounded-xl !text-primary !text-primaryColor !font-nerisSemiBold  hover:!scale-105 !transition-all !duration-300 ">
                  <EditIcon /> Edit Medication
                </Button>
              )} */}
              <Modal
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width="80%"
                height={"80%"}
                className="custom-modal-bg !bg-white !shadow-none !rounded-xl"
                footer={null}
                closable={false}
              >
                <AddMedicineModal id={id} setOpen={setOpen} data={data} />
              </Modal>
              {data?.medications?.length > 0 &&
                data?.prescriptionStatus !== "Completed" && (
                  <Button
                    onClick={handleSendToPharmacy}
                    className="!h-10 !px-5 !rounded-xl !font-nerisSemiBold !text-white !bg-primaryColor hover:!outline-none !transition-all !duration-300 hover:!text-white hover:!scale-105"
                  >
                    {SendToPharmacy.isPending ? (
                      <p>
                        <Loader />
                      </p>
                    ) : (
                      <p>Send to Pharmacy</p>
                    )}
                  </Button>
                )}

              {data?.prescriptionStatus === "Completed" && (
                <p className="bg-primaryColor px-4 py-2 rounded-xl text-white">
                  Sent
                </p>
              )}
            </div>
          </div>
          <div className="bg-[#F2F8FF] p-8 rounded-2xl h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 4xl:grid-cols-3 gap-3 bg-white w-full h-full rounded-t-2xl p-5">
              <div className="w-full h-full">
                <div className="rounded-2xl pt-5">
                  <div className="flex gap-3 flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className=" flex gap-2 items-center">
                      <div className=" overflow-hidden">
                        <img
                          className="w-[52px] h-[52px] object-cover rounded-full"
                          src={imageProvider.DetailProfile}
                        />
                      </div>
                      <div>
                        <p className="text-textPrimary font-nerisSemiBold space-x-2">
                          {data?.patient?.patientProfile?.firstName || "N/A"}{" "}
                          {data?.patient?.patientProfile?.lastName || "N/A"}
                        </p>
                        <p className="text-textSecondary font-Poppins font-light text-nowrap">
                          RX ID: 12
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl py-6  space-y-3">
                    <div className=" flex gap-2 sm:gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        Date of Birth
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        :
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold  sm:text-base text-sm">
                        {data?.patient?.patientProfile?.dateOfBirth
                          ? moment(
                              data?.patient?.patientProfile?.dateOfBirth
                            ).format("MM/DD/YYYY")
                          : "N/A"}
                      </p>
                    </div>
                    <div className=" flex gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        Types
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        :
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold  sm:text-base text-sm">
                        {data?.prescriptionType}
                      </p>
                    </div>
                    {/* @sarkar_096 */}
                    <div className=" flex gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        Payment Status
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        :
                      </p>
                      <p className={cn("text-textPrimary font-nerisSemiBold  sm:text-base text-sm", data?.paymentStatus == "Paid" && "bg-green-300 px-2 py-1 rounded-md")}>
                        {data?.paymentStatus}
                      </p>
                    </div>

                    <div className=" flex gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        Location
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        :
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        {data?.patient?.patientProfile?.address1},{" "}
                        {data?.patient?.patientProfile?.city},{" "}
                        {data?.patient?.patientProfile?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <p className="text-textPrimary font-nerisSemiBold  sm:text-lg  md:text-xl lg:text-2xl pt-8">
                  Requested Medicines
                </p>
                <div className="bg-white rounded-2xl">
                  <div className="bg-[#F2F8FF] rounded-2xl p-6 mt-5">
                    <div className="flex flex-col items-start gap-5">
                      {data &&
                        data?.medications?.map((med) => (
                          <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                            {med?.displayName}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <p className="text-textPrimary font-nerisSemiBold  sm:text-lg  md:text-xl lg:text-2xl pt-8">
                  Documents
                </p>
                <div className="bg-white rounded-2xl">
                  <div className="bg-[#F2F8FF] rounded-2xl p-6 mt-5">
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={(e) =>
                          handleDownload(
                            e,
                            data?.documents,
                            data?.fileName || "prescription-image.jpg"
                          )
                        }
                        className="flex items-center justify-between w-full p-2 rounded text-textPrimary font-nerisSemiBold sm:text-base text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Download prescription file"
                      >
                        <span>File</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* {data?.documents} */}
                    {/* <img src={data?.documents} alt="" /> */}

                    {/* <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm flex items-center justify-between w-full">
                        <span> Transcript.pdf (2mb)</span>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                              fill="black"
                            />
                          </svg>
                        </span>
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm flex items-center justify-between w-full">
                        <span> Transcript.pdf (2mb)</span>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                              fill="black"
                            />
                          </svg>
                        </span>
                      </p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-white p-5 rounded-b-2xl">
              <p className="text-textPrimary font-nerisSemiBold  sm:text-lg md:text-xl lg:text-2xl">
                Existing Conditions
              </p>
              <div className="bg-white rounded-2xl pt-6 w-full">
                <div className="bg-[#F2F8FF] rounded-2xl p-6 flex flex-col items-start gap-20">
                  {data?.prescriptionType === "New" ? (
                    <>
                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          healthConditionsAndSymptoms:{" "}
                          {data?.healthConditionsAndSymptoms || "N/A"}
                        </p>
                      </div>
                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          pastMedicalConditionsHistory :{" "}
                          {data?.pastMedicalConditionsHistory || "N/A"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        Current Medications: <br />
                        {data?.currentMedication || "N/A"}
                      </p>

                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          Reason for Medication: <br />
                          {data?.reasonforMedication || "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className=" flex gap-5">
                    <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                      Known Allergies: <br />
                      {data?.allergies || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
