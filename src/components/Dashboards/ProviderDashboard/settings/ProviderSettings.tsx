import { useMemo, useState } from "react";
import { Modal, Button, Input } from "antd";
import { DeleteSvg } from "../../../../assets/svgContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteData, GetData, PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { State } from "country-state-city";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { cn } from "../../../../lib/utils";
import { useTranslation } from "react-i18next";

type LicenseState = {
  id: number;
  state: string;
  licenseNumber: string;
  addstate: string;
  primary?: boolean;
  desc?: string;
};

const ProviderSettings = () => {
  const { t } = useTranslation("providerdashboard");
  const { control, watch, handleSubmit, reset } = useForm();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // const licenseInfo = {
  //   "NPI ID": "1598222284",
  //   "License No": "RN235301",
  //   Description: "Nurse Pra",
  //   "Enumeration Type": "NPI 1",
  //   Credential: "FNP",
  //   "Certificate Date": "2/22/2025",
  // };

  const US_STATE_COUNTRY_CODE = "US";
  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [licenseStates, setLicenseStates] = useState<LicenseState[]>([]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["license"],
    queryFn: () => GetData("license"),
  });

  const queryClient = useQueryClient();

  const AddState = useMutation({
    mutationKey: ["add-state"],
    mutationFn: (payload) => PostData("license", payload),
    onSuccess: (data) => {
      toast.success(t("state_added_successfully"));
      reset();
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["license"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });
  // const DeleteState = useMutation({
  //   mutationKey: ["add-state"],
  //   mutationFn: (payload) => DeleteData(`license/${payload}`),
  //   onSuccess: () => {
  //     toast.success("State deleted successfull");
  //     reset();
  //     setIsModalOpen(false);
  //     queryClient.invalidateQueries({ queryKey: ["license"] });
  //   },
  //   onError: (err) => {
  //     toast.error(err?.response?.data?.message);
  //   },
  // });
  const DeleteState = useMutation({
    mutationFn: (id: number) => DeleteData(`license/${id}`),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSettled: () => {
      setDeletingId(null); // reset after success/error
    },
    onSuccess: () => {
      toast.success(t("state_deleted_successfully"));
      queryClient.invalidateQueries({ queryKey: ["license"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (values: any) => {
    AddState.mutate(values);
    console.log("entry data", values);
  };

  const deleteLicense = (id: number) => {
    setLicenseStates((prev) => prev.filter((license) => license.id !== id));
  };

  // const licenses = [...(data?.licenses || []), ...licenseStates];
  const licensesRaw = [...(data?.licenses || []), ...licenseStates];

  // Ensure primary license is always at the top
  const licenses = useMemo(() => {
    if (!licensesRaw.length) return [];
    return [
      // primary first
      ...licensesRaw.filter((l) => l.primary),
      // all others after
      ...licensesRaw.filter((l) => !l.primary),
    ];
  }, [licensesRaw]);

  return (
    <div className="bg-[#F2F8FF] mb-10">
      <p className="font-nerisSemiBold lg:text-3xl text-2xl">
        {t("provider_setting")}
      </p>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <Loader color="#000000" />
        </div>
      ) : error ? (
        <p className="text-center">
          {t("something_went_wrong_try_to_refresh")}
        </p>
      ) : (
        <div className="bg-white rounded-2xl p-6 mt-5 w-full">
          <p className="font-nerisSemiBold md:text-2xl text-xl">
            {t("primary_license")}
          </p>

          <div className="grid grid-cols-1 gap-y-5 gap-x-10 w-full lg:w-1/2">
            {licenses
              ?.slice()
              // .reverse()
              .map((license, index, arr) => (
                <div className="w-full" key={license.id}>
                  {/* Show additional licenses header after first primary license */}
                  {index === arr.findIndex((l) => l.primary) + 1 && (
                    <p className="font-nerisSemiBold md:text-2xl text-xl mt-5">
                      {t("additional_licenses")}
                    </p>
                  )}
                  <div className="flex flex-col gap-5 items-stretch mt-5 w-full">
                    <div className="w-full flex flex-col sm:flex-row gap-5">
                      <div className="space-y-2 w-full sm:w-2/12">
                        <p className="font-semibold">{t("state")}</p>
                        {license.primary ? (
                          <div className="bg-[#F2F8FF] py-3 px-2 rounded-xl">
                            <p className="font-nerisSemiBold text-textPrimary text-center break-words whitespace-normal">
                              {license.state}
                            </p>
                          </div>
                        ) : (
                          // <Controller
                          //   name={`state-${license.id}`}
                          //   control={control}
                          //   defaultValue={license.state}
                          //   render={({ field }) => (
                          //     <Select
                          //       options={stateOptions}
                          //       value={stateOptions.find(
                          //         (opt) => opt.value === field.value
                          //       )}
                          //       onChange={(selectedOption) => {
                          //         field.onChange(selectedOption?.value || "");
                          //       }}
                          //       placeholder="Select state"
                          //       style={{ width: 160 }}
                          //     />
                          //   )}
                          // />
                          <div className="bg-[#F2F8FF] py-3 px-2 rounded-xl">
                            <p className="font-nerisSemiBold text-textPrimary text-center break-words whitespace-normal">
                              {license?.state}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 w-full">
                        <p className="font-semibold">{t("license_number")}</p>
                        <div className="bg-[#F2F8FF] py-3 px-5 rounded-xl w-full">
                          <p className="font-nerisSemiBold text-textPrimary text-center break-words whitespace-normal">
                            {license.licenseNumber}
                          </p>
                        </div>
                      </div>
                      {!license.primary && (
                        <div className="pt-8">
                          <button
                            onClick={() => DeleteState.mutate(license?.id)}
                            className={cn(
                              "bg-[#FFE2E2] py-3 px-3.5 rounded-2xl cursor-pointer w-fit self-center",
                              deletingId === license.id
                                ? "w-full sm:w-full"
                                : "sm:w-[52px]"
                                ? "w-full sm:w-full"
                                : "sm:w-[52px]"
                            )}
                          >
                            {deletingId === license.id ? (
                              <Loader
                                size={3}
                                className="w-10"
                                color="#000000"
                              />
                            ) : (
                              <>
                                <DeleteSvg />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 w-full">
                      <p className="font-semibold">{t("description")}</p>
                      <div className="bg-[#F2F8FF] py-3 px-5 rounded-xl">
                        <p className="font-nerisSemiBold text-textPrimary0 break-words whitespace-normal">
                          {license.desc || license.addstate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-5 items-center mx-auto w-fit mt-8">
            <Button
              onClick={showModal}
              className="!bg-white !h-12 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-100 w-full group !px-15"
            >
              + {t("add_new_license_state")}
            </Button>
          </div>
        </div>
      )}

      {/* License Details */}
      <div className="bg-white rounded-2xl p-6 mt-10">
        <p className="font-nerisSemiBold md:text-2xl text-xl">
          {t("license_details")}
        </p>
        {!data?.npiNumber ? (
          <p>{t("npi_id_not_found")}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-1">
              <p className="text-textPrimary font-nerisSemiBold">{t("npi_id")}</p>
              <p className="mt-2 text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full">
                {data?.npiNumber}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding license */}
      <Modal
        title={
          <span className="text-[32px] font-nerisSemiBold text-textPrimary">
            {t("add_license_state")}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="!bg-[#195B91] !px-6"
          >
            {AddState.isPending ? <Loader /> : <>Add</>}
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block font-nerisSemiBold text-textPrimary text-lg mb-2">
              {t("license_number")}
            </label>
            <Controller
              name="licenseNumber"
              control={control}
              rules={{ required: t("license_number_is_required") }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder={t("enter_license_number")}
                    className="!rounded-md !py-3 w-full"
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block font-nerisSemiBold text-textPrimary text-lg mb-2">
              {t("state")}
            </label>
            <Controller
              name="state"
              control={control}
              rules={{ required: t("state_is_required") }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    options={stateOptions}
                    placeholder={t("select_state")}
                    className="!rounded-md w-full"
                    isSearchable
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value || "");
                    }}
                    value={stateOptions.find(
                      (opt) => opt.value === field.value
                    )}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        height: "50px",
                        borderRadius: "0.375rem",
                        borderColor: state.isFocused ? "#195B91" : "#e5e7eb",
                        boxShadow: state.isFocused
                          ? "0 0 0 1px #195B91"
                          : "none",
                        "&:hover": {
                          borderColor: "#195B91",
                        },
                      }),
                      option: (baseStyles, { isFocused, isSelected }) => ({
                        ...baseStyles,
                        backgroundColor: isSelected
                          ? "#195B91"
                          : isFocused
                          ? "#F2F8FF"
                          : "white",
                        color: isSelected ? "white" : "black",
                        "&:active": {
                          backgroundColor: "#195B91",
                          color: "white",
                        },
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        padding: "8px 0",
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: "#9CA3AF",
                      }),
                    }}
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block font-nerisSemiBold text-textPrimary text-lg mb-2">
              {t("description")}
            </label>
            <Controller
              name="desc"
              control={control}
              rules={{ required: t("description_is_required") }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder={t("enter_description")}
                    className="!rounded-md !py-3 w-full"
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderSettings;