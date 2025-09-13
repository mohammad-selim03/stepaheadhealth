import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { DatePicker, Select } from "antd";
import moment, { type Moment } from "moment";
import { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../../provider/ContextProvider";

type Inputs = {
  firstName: string;
  lastName: string;
  dateOfBirth: Moment | null;
  gender?: "Male" | "Female" | "Other" | string;
  primaryPhone: number;
};

const Setp1 = forwardRef(
  (
    {
      onNext,
    }: {
      onNext: (
        data: Omit<Inputs, "dateOfBirth"> & { dateOfBirth: string }
      ) => void;
    },
    ref
  ) => {
    const { t } = useTranslation("patientprofilecreation");
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    const { data, setData } = useContext(MainContext);
    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<Inputs>();

    const email = JSON.parse(localStorage.getItem("email") || "null");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      const formattedData = {
        ...data,
        email: userInfo?.email || email,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth.format("YYYY-MM-DD")).toISOString()
          : "",
      };

      console.log("Form data:", formattedData);
      setData((prev) => ({ ...prev, ...formattedData }));
      onNext(formattedData);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    console.log("user", user?.phone);
    // Initialize form with context data
    useEffect(() => {
      const initialValues = {
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        dateOfBirth: data?.dateOfBirth ? moment(data.dateOfBirth) : null,
        primaryPhone: data?.primaryPhone || user?.phone || "",
        gender: data?.gender || "",
      };
      reset(initialValues);
    }, [data, reset, user?.phone]);
    return (
      <div>
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          {t("letsGetStarted")}
        </p>
        <form className="grid lg:grid-cols-2 gap-x-5 gap-y-1">
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
          <div className="flex gap-2 items-start flex-col pt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("primaryPhoneNumber")}
            </label>
            <input
              placeholder={t("phoneExample")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              {...register("primaryPhone", {
                required: true,
                pattern: {
                  value:
                    /^(\+1\s?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
                  message: t("validPhone"),
                },
                minLength: {
                  value: 10,
                  message: t("phone10digits"),
                },
                maxLength: {
                  value: 10,
                  message: t("phone10digits"),
                },
              })}
            />
            {errors.primaryPhone && (
              <span className="text-red-500">
                {errors?.primaryPhone?.message}
              </span>
            )}
          </div>
          {/* Date of Birth */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("dob")}
            </label>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{
                required: t("dobRequired"),
                validate: (value) => {
                  if (!value) return t("dobRequired");
                  if (!value.isValid()) return t("invalidDate");
                  return (
                    value.isBefore(moment(), "day") ||
                    t("futureDate")
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
                  // disabledDate={(current) =>
                  //   current && current > moment().endOf("day")
                  // }
                  disabledDate={(current) => {
                    const today = moment().endOf("day");
                    const oldestAllowedDate = moment()
                      .subtract(150, "years")
                      .startOf("day");
                    return (
                      current &&
                      (current > today || current < oldestAllowedDate)
                    );
                  }}
                />
              )}
            />
            {errors.dateOfBirth && (
              <span className="text-red-500">{errors.dateOfBirth.message}</span>
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
                <Select
                  {...field}
                  showSearch
                  placeholder={t("selectGender")}
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
        </form>
      </div>
    );
  }
);

export default Setp1;
