import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { DatePicker, Select } from "antd";
import moment, { type Moment } from "moment";
import { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { MainContext } from "../../../../provider/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import { useTranslation } from "react-i18next";

type Inputs = {
  firstName: string;
  lastName: string;
  dateOfBirth: Moment | null;
  gender: "Male" | "Female" | "Other";
};

const Step1 = forwardRef(
  (
    {
      onNext,
      doesData,
    }: {
      onNext: (
        data: Omit<Inputs, "dateOfBirth"> & { dateOfBirth: string }
      ) => void;
    },
    ref
  ) => {
    const { t } = useTranslation("providerdashboard");

    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<Inputs>({
      defaultValues: {
        firstName: doesData?.basic?.first_name || "",
        lastName: doesData?.basic?.last_name || "",
        gender: doesData?.basic?.gender == "F" ? "Female" : "Male",
        dateOfBirth: null,
      },
    });

    const { setData } = useContext(MainContext);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : "",
      };
      setData({ ...formattedData });
      onNext(formattedData);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    useEffect(() => {
      if (doesData) {
        reset({
          firstName: doesData?.basic?.first_name || "",
          lastName: doesData?.basic?.last_name || "",
          gender: doesData?.basic?.gender == "F" ? "Female" : "Male",
          dateOfBirth: null,
        });
      }
    }, [doesData, reset]);

    return (
      <div>
        <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl">
          {t("letsgetstarted")}
        </p>
        <form className="grid lg:grid-cols-2 gap-x-5 gap-y-1">
          {/* First Name */}
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("firstname")}
            </label>
            <input
              {...register("firstName", { required: true })}
              placeholder={t("enterfirstname")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.firstName && (
              <span className="text-red-500">{t("firstnamerequired")}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("lastname")}
            </label>
            <input
              {...register("lastName", { required: true })}
              placeholder={t("enterlastname")}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.lastName && (
              <span className="text-red-500">{t("lastnamerequired")}</span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              {t("dateofbirth")}
            </label>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{
                required: t("dateofbirthrequired"),
                validate: (value) => {
                  if (!value) return t("dateofbirthrequired");
                  if (!value.isValid()) return t("invaliddate");

                  const minAgeDate = moment().subtract(12, "years");
                  if (!value.isBefore(minAgeDate, "day")) {
                    return t("minagedate");
                  }

                  if (!value.isBefore(moment(), "day")) {
                    return t("futuredate");
                  }

                  return true;
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
              rules={{ required: t("genderrequired") }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder={t("selectgender")}
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

export default Step1;
