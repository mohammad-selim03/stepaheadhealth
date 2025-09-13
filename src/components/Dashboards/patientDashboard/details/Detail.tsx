import { Button, Modal } from "antd";
import { imageProvider } from "../../../../lib/imageProvider";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GetData, PostData } from "../../../../api/API";
import AddMedicineModal from "../../ProviderDashboard/details/AddMedicineModal";
import { ChatIcon, EditIcon } from "../../../Generals/Home/HomeIcons";
import Loader from "../../../common/Loader";
import { useTranslation } from "react-i18next";
import moment from "moment";

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
  const { t } = useTranslation("patientdashboard");
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

  const FileDownloader = (fileUrl) => {
    const handleDownload = () => {
      // Create an anchor element
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "prescription.png"; // desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {t("downloadFile")}
      </button>
    )
  };

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </div>
  ) : error ? (
    <div className="flex items-center justify-center h-screen">
      {t("somethingWentWrongError")}
    </div>
  ) : (
    <div>
      <div className="flex sm:items-center items-start justify-between mb-10 pr-5">
        <p className="text-textPrimary font-nerisSemiBold  text-[32px] ">
          {t("details")}
        </p>

        <div className=" flex flex-col sm:flex-row gap-3">
          <Link to={"/messages"}>
            <Button className="!bg-primaryColor !h-10 !rounded-xl !text-white !font-nerisSemiBold  hover:!scale-105 !transition-all !duration-300 !px-5">
              <ChatIcon />
              {t("chatWithDoctor")}
            </Button>
          </Link>
          {/* {data?.prescriptionStatus == "Pending" && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => HandleStatus.mutate({ status: "Approved" })}
                className="!bg-[#E2FFEB] !h-10 !rounded-xl !text-[#02A133] !border !border-[#02A133] !flex !items-center !justify-center !font-nerisSemiBold !px-5 hover:!scale-105 !transition-all !duration-300"
              >
                {HandleStatus.isPending ? (
                  <p>
                    <Loader />
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
          )} */}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <p className="text-textPrimary font-nerisSemiBold md:text-2xl sm:text-xl text-base">
          {t("rxRequestedId")}
        </p>

        <div>
          {" "}
          <div className="flex items-center justify-between">
            <p className="text-textPrimary font-nerisSemiBold sm:text-lg text-xl py-8">
              {t("information")}
            </p>
            {/* <div className=" flex flex-col sm:flex-row gap-3">
              {data?.prescriptionType == "New" &&
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
            </div> */}
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
                          {t("rxId")}: 12
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl py-6  space-y-3">
                    <div className=" flex gap-2 sm:gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        {t("dateOfBirth")}
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
                        {t("types")}
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
                        {t("paymentStatus")}
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        :
                      </p>
                      <p className="text-textPrimary font-nerisSemiBold  sm:text-base text-sm">
                        {data?.paymentStatus}
                      </p>
                    </div>

                    <div className=" flex gap-5">
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        {t("location")}
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
                  {t("requestedMedicines")}
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
                  {t("documents")}
                </p>
                <div className="bg-white rounded-2xl">
                  <div className="bg-[#F2F8FF] rounded-2xl p-6 mt-5">
                    <div className="flex flex-col items-start gap-5">
                      {/* <img src={data?.documents} alt="" /> */}
                      {data?.documents?.map((doc, idx) => (
                        <p
                          key={idx}
                          className="text-textPrimary font-nerisSemiBold sm:text-base text-sm flex items-center justify-between w-full"
                        >
                          <span> {t("file")}</span>
                          <button onClick={() => FileDownloader(doc)}>
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
                          </button>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-white p-5 rounded-b-2xl">
              <p className="text-textPrimary font-nerisSemiBold  sm:text-lg md:text-xl lg:text-2xl">
                {t("existingConditions")}
              </p>
              <div className="bg-white rounded-2xl pt-6 w-full">
                <div className="bg-[#F2F8FF] rounded-2xl p-6 flex flex-col items-start gap-20">
                  {data?.prescriptionType === "New" ? (
                    <>
                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          {t("healthConditionsAndSymptomsLabel")}{" "}
                          {data?.healthConditionsAndSymptoms || "N/A"}
                        </p>
                      </div>
                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          {t("pastMedicalConditionsHistoryLabel")} {" "}
                          {data?.pastMedicalConditionsHistory || "N/A"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                        {t("currentMedicationsLabel")} {data?.currentMedication || "N/A"}
                      </p>

                      <div className=" flex gap-5">
                        <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                          {t("reasonForMedicationLabel")}
                          {data?.reasonforMedication || "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className=" flex gap-5">
                    <p className="text-textPrimary font-nerisSemiBold sm:text-base text-sm">
                      {t("knownAllergiesLabel")}{data?.allergies || "N/A"}
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
