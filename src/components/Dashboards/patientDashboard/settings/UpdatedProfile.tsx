import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadPicture from "./UploadPicture";
import { Button, DatePicker, Select as SelectAnd } from "antd";
import Select from "react-select";
import moment, { type Moment } from "moment";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PatientChangePassword from "./PatientChangePassword";
import { City, State } from "country-state-city";

type Inputs = {
  firstName: string;
  lastName: string;
  dateOfBirth: Moment | null;
  gender: "Male" | "Female" | "Other";
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  country: string;
  height: string;
  weight: string;
  email: string;
  primaryPhone: number;
  medicalPreConditions: string[];
  avatar?: string;
};

const UpdatedProfile = () => {
  const { t } = useTranslation("patientdashboard");
  const { data, isLoading, error } = useQuery<Inputs>({
    queryKey: ["patient-profile"],
    queryFn: () => GetData("patient/profile"),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      dateOfBirth: data?.dateOfBirth ? moment(data?.dateOfBirth) : "",
      gender: data?.gender,
      email: data?.email || "",
      address1: data?.address1 || "",
      address2: data?.address2 || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "",
      zipCode: data?.zipCode || "",
      primaryPhone: data?.primaryPhone,
      weight: data?.weight || "",
      height: data?.height || "",
    },
  });
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [zipOptions, setZipOptions] = useState([]);
  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(
        US_STATE_COUNTRY_CODE,
        selectedState
      );
      setCityOptions(
        cities.map((city) => ({
          label: city.name,
          value: city.name,
        }))
      );

      // If you have ZIP data:
      // setZipOptions(lookupZipsByState(selectedState));
    } else {
      setCityOptions([]);
      setZipOptions([]);
    }
  }, [selectedState]);
  const customStyles = {
    control: (base) => ({
      ...base,
      paddingTop: 5,
      paddingBottom: 5,
      border: "1px solid #E5E5E5",
    }),
  };

  // Initialize form with context data
  useEffect(() => {
    const initialValues = {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      dateOfBirth: data?.dateOfBirth ? moment(data?.dateOfBirth) : "",
      gender: data?.gender,
      email: data?.email || "",
      address1: data?.address1 || "",
      address2: data?.address2 || "",
      city: data?.city || "",
      state: data?.state || "",
      country: data?.country || "",
      zipCode: data?.zipCode || "",
      primaryPhone: data?.primaryPhone,
      weight: data?.weight || "",
      height: data?.height || "",
    };
    reset(initialValues);
    if (initialValues.state) {
      setSelectedState(initialValues.state);
    }
  }, [data, reset]);
  // 1. Update your mutation to properly handle dates
  const updateProfile = useMutation({
    mutationKey: ["patient-profile"],
    mutationFn: (payload: Inputs) => {
      // Convert Moment objects to ISO strings before sending
      const apiPayload = {
        ...payload,
        dateOfBirth: payload.dateOfBirth?.toISOString() || null,
      };
      return PostData("patient/profile", apiPayload, "put");
    },
    onSuccess: () => {
      toast.success(t("profileUpdatedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
      // Don't reset here - let the useEffect handle it after data refetch
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateProfile.mutate(data);
  };

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth) : null,
        gender: data?.gender,
        email: data?.email || "",
        address1: data?.address1 || "",
        address2: data?.address2 || "",
        city: data?.city || "",
        state: data?.state || "",
        country: data?.country || "",
        zipCode: data?.zipCode || "",
        primaryPhone: data?.primaryPhone,
        weight: data?.weight || "",
        height: data?.height || "",
      });
    }
  }, [reset, data]);

  const PasswordChange = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (payload) => PostData("", payload),
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed  to change password`"
      );
    },
  });
  const stateValue = watch("state");
  const US_STATE_COUNTRY_CODE = "US";
  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (stateValue) {
      localStorage.setItem("state", JSON.stringify(stateValue));
    }
  }, [stateValue]);

  return (
    <div className="space-y-4">
      <p className="font-nerisSemiBold text-3xl p-3 rounded-xl">
        {t("settings")}
      </p>
      {isLoading ? (
        <p className="flex items-center justify-center h-screen">
          <Loader color="#000000" />
        </p>
      ) : (
        <div className="bg-white rounded-2xl p-6 mt-10">
          <div>
            <UploadPicture avatar={data?.avatar} />
          </div>
          <div>
            <Toaster />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1"
            >
              {/* First Name */}
              <div className="flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("firstName")}
                </label>
                <input
                  {...register("firstName", { required: true })}
                  placeholder={t("enterFirstName")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.firstName && (
                  <span className="text-red-500">{t("firstNameRequired")}</span>
                )}
              </div>

              {/* Last Name */}
              {/* Last Name */}
              <div className="flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("lastName")}
                </label>
                <input
                  {...register("lastName", { required: true })}
                  placeholder={t("enterLastName")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.lastName && (
                  <span className="text-red-500">{t("lastNameRequired")}</span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("dateOfBirth")}
                </label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  disabled
                  rules={{
                    required: t("dateOfBirthRequired"),
                    validate: (value) => {
                      if (!value) return t("dateOfBirthRequired");
                      if (!value.isValid()) return t("invalidDate");
                      return (
                        value.isBefore(moment(), "day") ||
                        t("dateCannotBeInFuture")
                      );
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value}
                      format="MM-DD-YYYY"
                      onChange={(date) => field.onChange(date)}
                      className="w-full !py-3"
                      disabledDate={(current) =>
                        current && current > moment().endOf("day")
                      }
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <span className="text-red-500">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("gender")}
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: t("genderRequired") }}
                  render={({ field }) => (
                    <SelectAnd
                      {...field}
                      showSearch 
                      placeholder={t("selectGender")}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                      style={{ height: "48px" }}
                      value={field.value}
                      className="w-full"
                      styles={{
                        control: (base) => ({
                          ...base, 
                          borderRadius: 6,
                          padding: 4,
                        }),
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        { value: "Male", label: t("male") },
                        { value: "Female", label: t("female") },
                        { value: "Other", label: t("other") },
                      ]}
                    />
                  )}
                />
                {errors.gender && (
                  <span className="text-red-500">{errors.gender.message}</span>
                )}
              </div>
              {/* Height */}
              <div className="flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("heightLB")}
                </label>
                <input
                  {...register("height", { required: true })}
                  placeholder={t("enterHeight")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.height && (
                  <span className="text-red-500">{t("heightRequired")}</span>
                )}
              </div>

              {/* Weight */}
              <div className="flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("weightIN")}
                </label>
                <input
                  {...register("weight", { required: true })}
                  placeholder={t("enterWeight")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.weight && (
                  <span className="text-red-500">{t("weightRequired")}</span>
                )}
              </div>
              {/* Email */}
              <div className=" flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("emailID")}
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
                  placeholder={t("enterEmail")}
                  type="email"
                  readOnly
                  value={data?.email}
                  disabled
                />
                {errors.email && (
                  <span className="text-red-500">{t("emailRequired")}</span>
                )}
              </div>
              {/* Mobile */}
              <div className=" flex gap-2 items-start flex-col mt-3">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("mobileNumber")}
                </label>

                <input
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
                  placeholder={t("enterMobileNumber")}
                  type="number"
                  readOnly
                  disabled
                  {...register("primaryPhone", { required: true })}
                />
                {errors.primaryPhone && (
                  <span className="text-red-500">
                    <span className="text-red-500">
                      {t("mobileNumberRequired")}
                    </span>
                  </span>
                )}
              </div>
              {/*  Address Line 1 */}
              <div className="flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("addressLine1")}
                </label>
                <input
                  {...register("address1", { required: true })}
                  placeholder={t("enterAddress")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.address1 && (
                  <span className="text-red-500">{t("addressRequired")}</span>
                )}
              </div>
              {/*  Address Line 2 */}
              <div className="flex gap-2 items-start flex-col mt-6">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("addressLine2")}
                </label>
                <input
                  {...register("address2", { required: false })}
                  placeholder={t("enterAddressLine2")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.address2 && (
                  <span className="text-red-500">{t("addressRequired")}</span>
                )}
              </div>
              {/* State */}
              <div className="flex gap-2 items-start flex-col w-full">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("state")}
                </label>
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={stateOptions}
                      placeholder="Select State"
                      isClearable
                      onChange={(val) => field.onChange(val?.value ?? "")}
                      className="w-full"
                      value={
                        stateOptions.find((opt) => opt.value === field.value) ??
                        null
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.state ? " " : "#e5e7eb",
                          borderRadius: 6,
                          padding: 4,
                        }),
                      }}
                    />
                  )}
                />
                {/* <input
                  {...register("state", { required: true })}
                  placeholder={t("enterState")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                /> */}
                {errors.state && (
                  <span className="text-red-500">{t("stateRequired")}</span>
                )}
              </div>
              {/*  City */}
              <div className="flex gap-2 items-start flex-col">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("city")}
                </label>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: t("cityRequired") }}
                  render={({ field }) => (
                    <Select
                      options={cityOptions}
                      value={cityOptions.find(
                        (opt) => opt.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                      styles={customStyles}
                      placeholder={t("selectCity")}
                      className="w-full !bg-white"
                      isClearable
                      isDisabled={!selectedState}
                    />
                  )}
                />
                {/* <input
                  {...register("city", { required: true })}
                  placeholder={t("enterCity")}
                  type="text"
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                /> */}
                {errors.city && (
                  <span className="text-red-500">{t("cityRequired")}</span>
                )}
              </div>
              {/* Post Code */}
              <div className="flex gap-2 items-start flex-col">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("postalCode")}
                </label>
                <input
                  {...register("zipCode", { required: true })}
                  placeholder={t("enterPostalCode")}
                  type="text"
                  readOnly
                  disabled
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.zipCode && (
                  <span className="text-red-500">
                    {t("postalCodeRequired")}
                  </span>
                )}
              </div>
              {/* Country */}
              <div className="flex gap-2 items-start flex-col">
                <label className="text-textPrimary font-nerisSemiBold">
                  {t("country")}
                </label>
                <input
                  {...register("country", { required: true })}
                  placeholder={t("enterCountry")}
                  type="text"
                  // readOnly
                  // disabled
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                />
                {errors.country && (
                  <span className="text-red-500">{t("countryRequired")}</span>
                )}
              </div>
              <Button
                htmlType="submit"
                className="!bg-primaryColor md:!h-12 !h-10 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 md:!col-span-2 !w-fit !mx-auto !px-10 !mt-8"
              >
                {updateProfile.isPending ? (
                  <p>
                    <Loader />
                  </p>
                ) : (
                  <p> {t("saveChanges")}</p>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* password change */}
      {/* <div className="py-10">
        <p className="text-2xl font-semibold">Change Password</p>
        <form>
          <div className="flex flex-col items-start gap-2">
            <label>Current Password</label>
            <input
              type="password"
              className="px-3 py-2 rounded-xl border border-gray-200 outline-0"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label>New Password</label>
            <input
              type="password"
              className="px-3 py-2 rounded-xl border border-gray-200 outline-0"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label>New Confirm Password</label>
            <input
              type="password"
              className="px-3 py-2 rounded-xl border border-gray-200 outline-0"
            />
          </div>
        </form>
      </div> */}
      <PatientChangePassword />
    </div>
  );
};

export default UpdatedProfile;
