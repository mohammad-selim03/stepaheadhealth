import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UploadPicture from "./ProfilePicture";
import { Button, DatePicker, Select as SelectAnd } from "antd";
import Select from "react-select";
import moment, { type Moment } from "moment";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { GetData, PostData } from "../../../../api/API";
import { useTranslation } from "react-i18next";
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
  email: string;
  bio: string;
  primaryPhone: number;
};

const ProfileSetting = () => {
  const { t } = useTranslation("providerdashboard");
  const queryClient = useQueryClient();
  const [currentAvatar, setCurrentAvatar] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["clinician-profile"],
    queryFn: () => GetData("clinician/profile"),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  const updateMutation = useMutation({
    mutationFn: (formData: Inputs) =>
      PostData("clinician/profile", formData, "put"),
    onSuccess: () => {
      toast.success(t("profile_updated_successfully"));
      queryClient.invalidateQueries({ queryKey: ["clinician-profile"] });
    },
    onError: (error) => {
      toast.error(t("failed_to_update_profile"));
      console.error("Update error:", error);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [selectedState, setSelectedState] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [zipOptions, setZipOptions] = useState([]);

  const stateValue = watch("state");
  const US_STATE_COUNTRY_CODE = "US";
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

  // Populate form with API data when data is loaded
  useEffect(() => {
    if (data) {
      const profileData = data;
      setCurrentAvatar(profileData?.avatar || "");
      // Set form values
      setValue("firstName", profileData.firstName || "");
      setValue("lastName", profileData.lastName || "");
      setValue(
        "dateOfBirth",
        profileData.dateOfBirth ? moment(profileData.dateOfBirth) : null
      );
      setValue(
        "gender",
        (profileData.gender as "Male" | "Female" | "Other") || "Male"
      );
      setValue("address1", profileData.address1 || "");
      setValue("address2", profileData.address2 || "");
      setValue("state", profileData.state || "");
      setValue("city", profileData.city || "");
      setValue("zipCode", profileData.zipCode || "");
      setValue("country", profileData.country || "");
      setValue("email", profileData.email || "");
      setValue("bio", profileData.bio || "");
      setValue("primaryPhone", parseInt(profileData.primaryPhone) || 0);
    }
  }, [data, setValue]);

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
      bio: data?.bio || "",
    };
    reset(initialValues);
    if (initialValues.state) {
      setSelectedState(initialValues.state);
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log("Form data being submitted:", formData);

    // Transform form data to match API expectations
    const updatePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth?.toISOString(),
      gender: formData.gender,
      address1: formData.address1,
      address2: formData.address2,
      state: formData.state,
      city: formData.city,
      zipCode: formData.zipCode,
      country: formData.country,
      email: formData.email,
      bio: formData.bio,
      primaryPhone: formData.primaryPhone.toString(),
    };

    console.log("Payload being sent to API:", updatePayload);
    updateMutation.mutate(updatePayload as any);
  };

  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry(US_STATE_COUNTRY_CODE).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  }, []);

  const handleAvatarChange = (newAvatarUrl: string) => {
    setCurrentAvatar(newAvatarUrl);

    // Update cache immediately so Navbar & everywhere else reflects instantly
    queryClient.setQueryData(["clinician-profile"], (oldData: any) => {
      if (!oldData) return { avatar: newAvatarUrl };
      return {
        ...oldData,
        avatar: newAvatarUrl,
      };
    });

    // Optionally also refetch to stay in sync with backend
    queryClient.invalidateQueries({ queryKey: ["clinician-profile"] });
  };

  if (isLoading) {
    return <div>{t("loading_profile")}</div>;
  }

  if (error) {
    return <div>{t("error_loading_profile")}</div>;
  }

  return (
    <div>
      <p className="font-nerisSemiBold text-3xl">{t("profile_setting")}</p>
      <div className="bg-white rounded-2xl p-6 mt-10">
        <div className="flex items-start gap-5">
          <div className="w-[30%]">
            <UploadPicture
              avatar={currentAvatar}
              onAvatarChange={handleAvatarChange}
            />
          </div>
          <div className="w-full pt-10">
            <label className="text-textPrimary font-nerisSemiBold text-sm sm:text-base md:text-lg lg:text-xl">
              {/* {t("bio")} */}
              Biography
            </label>
            <div className="pt-10">
              <textarea
                {...register("bio", { required: true })}
                placeholder={t("enter_bio")}
                className="text-textSecondary font-Poppins font outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[300px]"
              />
            </div>
            {errors.bio && (
              <span className="text-red-500">{t("bio_is_required")}</span>
            )}
          </div>
        </div>
        <div>
          <Toaster />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid lg:grid-cols-2 gap-x-5 gap-y-1"
          >
            {/* Bio & First Name */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold mt-4">
                {t("first_name")}
              </label>
              <input
                {...register("firstName", { required: true })}
                placeholder={t("enter_first_name")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.firstName && (
                <span className="text-red-500">
                  {t("first_name_is_required")}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex gap-2 items-start flex-col mt-4">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("last_name")}
              </label>
              <input
                {...register("lastName", { required: true })}
                placeholder={t("enter_last_name")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.lastName && (
                <span className="text-red-500">
                  {t("last_name_is_required")}
                </span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("date_of_birth")}
              </label>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                  required: t("date_of_birth_is_required"),
                  validate: (value) => {
                    if (!value) return t("date_of_birth_is_required");
                    if (!value.isValid()) return t("invalid_date");
                    return (
                      value.isBefore(moment(), "day") ||
                      t("date_cannot_be_in_the_future")
                    );
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    format="YYYY-MM-DD"
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
                rules={{ required: t("gender_is_required") }}
                render={({ field }) => (
                  <SelectAnd
                    {...field}
                    showSearch
                    placeholder={t("select_a_gender")}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    style={{ height: "48px" }}
                    value={field.value}
                    className="w-full"
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
            {/* Email */}
            <div className=" flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("email_id")}
              </label>

              <input
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
                placeholder={t("enter_email")}
                type="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500">{t("email_is_required")}</span>
              )}
            </div>
            {/* Mobile */}
            <div className=" flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("mobile_number")}
              </label>

              <input
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
                placeholder={t("enter_mobile_number")}
                type="number"
                {...register("primaryPhone", { required: true })}
              />
              {errors.primaryPhone && (
                <span className="text-red-500">
                  {t("mobile_number_is_required")}
                </span>
              )}
            </div>
            {/*  Address Line 1 */}
            <div className="flex gap-2 items-start flex-col mt-6">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("address_line_1")}
              </label>
              <input
                {...register("address1", { required: true })}
                placeholder={t("enter_address")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.address1 && (
                <span className="text-red-500">{t("address_is_required")}</span>
              )}
            </div>
            {/*  Address Line 2 */}
            <div className="flex gap-2 items-start flex-col mt-6">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("address_line_2")}
              </label>
              <input
                {...register("address2", { required: true })}
                placeholder={t("enter_address_line_2")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.address2 && (
                <span className="text-red-500">{t("address_is_required")}</span>
              )}
            </div>
            {/* State */}
            <div className="flex gap-2 items-start flex-col">
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
                placeholder={t("enter_state")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              /> */}
              {errors.state && (
                <span className="text-red-500">{t("state_is_required")}</span>
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
                    value={cityOptions.find((opt) => opt.value === field.value)}
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
                placeholder={t("enter_city")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              /> */}
              {errors.city && (
                <span className="text-red-500">{t("city_is_required")}</span>
              )}
            </div>
            {/* Post Code */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                {t("postal_code")}
              </label>
              <input
                {...register("zipCode", { required: true })}
                placeholder={t("enter_postal_code")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.zipCode && (
                <span className="text-red-500">
                  {t("postal_code_is_required")}
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
                placeholder={t("enter_country")}
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.country && (
                <span className="text-red-500">{t("country_is_required")}</span>
              )}
            </div>
            <Button
              htmlType="submit"
              loading={updateMutation.isPending}
              className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 lg:!col-span-2 !w-fit !mx-auto !px-10 !mt-8"
            >
              {updateMutation.isPending ? t("saving") : t("save_changes")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
