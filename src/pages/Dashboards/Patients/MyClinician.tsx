import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import { imageProvider } from "../../../lib/imageProvider";
import ClinicianTable from "./ClinicianTable";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const MyClinician = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation("patientdashboard");
  const queryClient = useQueryClient();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const { data: prof } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData("patient/profile"),
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["current-clinician"],
    queryFn: () =>
      GetData(`patient/current-clinician/${userInfo?.assignedClinicianId}`),
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Function to manually refresh the data
  // const refreshClinicianData = () => {
  //   queryClient.invalidateQueries({ queryKey: ["current-clinician"] });
  // };

  // Function to refetch current clinician immediately after selection
  const handleClinicianSelection = async () => {
    // Update userInfo from localStorage in case it changed
    const updatedUserInfo = JSON.parse(
      localStorage.getItem("userInfo") || "null"
    );
    if (updatedUserInfo?.assignedClinicianId) {
      await refetch(); // Immediately refetch current clinician data
    }
  };

  const info = data?.medicalLicenses?.find((d) => d?.primary === true);

  console.log("info", info);

  return (
    <div className="space-y-4">
      <p className="pb-3 text-2xl md:text-3xl font-semibold p-3 rounded-xl w-full">
        {t("myProvider")}
      </p>
      {isLoading ? (
        <p className="flex items-center justify-center h-80">
          <Loader color="#000000" />
        </p>
      ) : (
        <div className="bg-white h-screen rounded-2xl p-5 flex flex-col items-start gap-5 lg:gap-10 xl:gap-20">
          <div className="space-y-2 w-[40%]">
            {/* <p className="py-4 text-xl font-semibold">
              {t("currentClinician")}
            </p> */}
            <div className="flex gap-2 items-center">
              <img
                src={data?.avatar || imageProvider.defaultImg}
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex flex-col items-start gap-1">
                <p className="text-xl">
                  {data?.firstName || "N/A"} {data?.lastName || ""}
                </p>
                <p className="text-base text-textSecondary">
                  {data?.medicalLicenses?.[0]?.desc}
                </p>
              </div>
            </div>
            <div className="space-y-2 pt-5">
              <p className="font-semibold text-textSecondary">
                {t("newPrescriptionFee")}{" "}
                <span className="text-primaryColor">
                  ${data?.prescriptionCharges?.newPrescriptionFee || "N/A"}
                </span>
              </p>
              <p className="font-semibold text-textSecondary">
                {t("refillPrescriptionFee")}{" "}
                <span className="text-primaryColor">
                  $ {data?.prescriptionCharges?.refillPrescriptionFee || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="h-40 w-full flex flex-col items-start justify-between">
              <p className="text-xl font-semibold">Biography</p>
              <p className="pt-5">{data.bio}</p>
              <div className="pt-5">
                {data?.canChangeClinician === true && (
                  <button
                    onClick={() => setShow(!show)}
                    className="border border-primaryColor text-primaryColor px-3 py-2 rounded-xl hover:bg-primaryColor hover:text-white transition-all duration-300"
                  >
                    {!show ? "Show" : "Hide"} Other Clinicians
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {show && <ClinicianTable onClinicianSelect={handleClinicianSelection} />}
    </div>
  );
};

export default MyClinician;
