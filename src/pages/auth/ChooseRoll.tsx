import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { PatientRoleIcon, ProviderRoleIcon } from "./AuthIcons";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const ChooseRoll = () => {
  const { t } = useTranslation("chooseroll");
  const [role, setRole] = useState(() =>
    JSON.parse(localStorage.getItem("role") || "null")
  );
  const handleRole = (role: string) => {
    localStorage.setItem("role", JSON.stringify(role));
    setRole(role);
  };

  const navigate = useNavigate();
  const handleNavigate = () => {
    if (!role) return toast.error(t("error"));

    navigate("/signup");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white outline outline-primaryColor rounded-md p-6 w-full order-1 3xl:order-2">
        <h2 className="text-3xl font-semibold text-primaryColor">
          {t("title")}
        </h2>
        <p className="text-textSecondary">
          {t("subtitle")}
        </p>

        <div className="py-10 flex flex-col gap-5">
          <button
            onClick={() => handleRole("Clinician")}
            className={cn(
              "border border-gray-300 rounded-lg px-4 py-4 w-full flex items-center gap-5 text-xl font-semibold text-textSecondary focus:border-primaryColor focus-within:bg-primaryColor/5"
            )}
          >
            <ProviderRoleIcon />
            <span>{t("providerButton")}</span>
          </button>
          <button
            onClick={() => handleRole("Patient")}
            className={cn(
              "border border-gray-300 rounded-lg px-4 py-4 w-full flex items-center gap-5 text-xl font-semibold text-textSecondary focus:border-primaryColor focus-within:bg-primaryColor/5"
            )}
          >
            <PatientRoleIcon />
            <span>{t("patientButton")}</span>
          </button>
        </div>

        <div className="py-10">
          <button
            onClick={handleNavigate}
            className="bg-primaryColor w-full px-5 py-2 rounded-2xl text-white"
          >
            {t("nextButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRoll;
