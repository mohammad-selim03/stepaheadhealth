import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import moment, { type Moment } from "moment";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { DatePicker, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { MainContext } from "../../../../provider/ContextProvider";

type Inputs = {
  firstName: string;
  lastName: string;
  dateOfBirth: Moment | null;
  gender: "male" | "female" | "other";
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
  currentMedication: string;
  reasonforMedication: string;
  allergies: string;
};

const Step4 = forwardRef(
  (
    { onNext }: { onNext: (data: Inputs) => void },
    ref: React.Ref<{ submit: () => void }>
  ) => {
    // const [reason, setReason] = useState("");
    // const [currentMedication, setcurrentMedication] = useState("");
    // const [allergies, setallergies] = useState("");

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inputs>();

    const { data, isLoading, error } = useQuery<Inputs>({
      queryKey: ["patient-profile"],
      queryFn: () => GetData("patient/profile"),
    });
    const { setData } = useContext(MainContext);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("Step 2 form data:", data);
      localStorage.setItem("allergies", JSON.stringify(data?.allergies));
      localStorage.setItem(
        "currentMedication",
        JSON.stringify(data?.currentMedication)
      );
      localStorage.setItem(
        "reasonforMedication",
        JSON.stringify(data?.reasonforMedication)
      );
      const combinedData = {
        ...data,
        prescriptionType: "Refill",
      };
      setData((prev) => ({ ...prev, ...combinedData }));
      onNext(data);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    console.log("dataaaaaaaaa", data);
    const fullName = data?.firstName + data?.lastName;

    return isLoading ? (
      <p className="flex items-center justify-center h-screen">
        <Loader color="#00000" />
      </p>
    ) : (
      <div className="sm:p-6 p-3  bg-white">
        <p className="text-textPrimary font-nerisSemiBold text-2xl">
          Patient Information
        </p>

        <form className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-5 gap-y-3 bg-[#F2F8FF] rounded-2xl sm:p-6 p-3 mt-5">
          {/* First Name */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">Name</label>
            <input
              // {...register("FirstName", { required: true })}
              value={fullName || "N/A"}
              placeholder="Enter  Name"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.firstName && (
              <span className="text-red-500">First Name is required</span>
            )}
          </div>

          {/* Email */}
          <div className=" flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Email ID
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
              // {...register("email", { required: true })}
              value={data?.email || "N/A"}
            />
            {errors.email && (
              <span className="text-red-500">Email is required</span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Date of Birth
            </label>
            <input
              type="dob"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
              // {...register("email", { required: true })}
              value={
                data?.dateOfBirth
                  ? moment(data.dateOfBirth).format("MM/DD/YYYY")
                  : "N/A"
              }
            />

            {errors.dateOfBirth && (
              <span className="text-red-500">{errors.dateOfBirth.message}</span>
            )}
          </div>

          {/* Gender */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Gender
            </label>
            {/* <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select a Gender"
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
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              )}
            /> */}
            <input
              type="gender"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
              // {...register("email", { required: true })}
              value={data?.gender || "N/A"}
            />
            {errors.gender && (
              <span className="text-red-500">{errors.gender.message}</span>
            )}
          </div>
          {/* Height */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Height (LB)
            </label>
            <input
              // {...register("Height", { required: true })}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              value={data?.height || "N/A"}
            />
            {errors.height && (
              <span className="text-red-500">Height is required</span>
            )}
          </div>

          {/* Weight */}
          <div className="flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Weight (IN)
            </label>
            <input
              // {...register("Weight", { required: true })}
              value={data?.weight || "N/A"}
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.weight && (
              <span className="text-red-500">Weight is required</span>
            )}
          </div>

          {/* Mobile */}
          <div className=" flex gap-2 items-start flex-col mt-3">
            <label className="text-textPrimary font-nerisSemiBold">
              Mobile Number
            </label>

            <input
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
              placeholder="Enter Mobile Number"
              type="number"
              // {...register("mobialNumber", { required: true })}
              value={data?.primaryPhone || "N/A"}
            />
            {errors.primaryPhone && (
              <span className="text-red-500">Mobile number is required</span>
            )}
          </div>
          <div></div>
          {/*  Address Line 1 */}
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              Address Line 1
            </label>
            <input
              // {...register("Address1", { required: true })}
              value={data?.address1 || "N/A"}
              placeholder="Enter Address"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.address1 && (
              <span className="text-red-500">Address is required</span>
            )}
          </div>
          {/*  Address Line 2 */}
          <div className="flex gap-2 items-start flex-col mt-6">
            <label className="text-textPrimary font-nerisSemiBold">
              Address Line 2
            </label>
            <input
              // {...register("Address2", { required: true })}
              value={data?.address2 || "N/A"}
              placeholder="Enter Address Line 2"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.address2 && (
              <span className="text-red-500">Address is required</span>
            )}
          </div>
          {/* State */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">State</label>
            <input
              // {...register("State", { required: true })}
              value={data?.state}
              placeholder="Enter State"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.state && (
              <span className="text-red-500">State is required</span>
            )}
          </div>
          {/*  City */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">City</label>
            <input
              // {...register("City", { required: true })}
              value={data?.city}
              placeholder="Enter City"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.city && (
              <span className="text-red-500">City is required</span>
            )}
          </div>
          {/* Post Code */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              Postal Code
            </label>
            <input
              // {...register("Code", { required: true })}
              value={data?.zipCode}
              placeholder="Enter Postal Code"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.zipCode && (
              <span className="text-red-500">Postal Code is required</span>
            )}
          </div>
          {/* Country */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              Country
            </label>
            <input
              // {...register("Country", { required: true })}
              value={data?.country}
              placeholder="Enter Country"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.country && (
              <span className="text-red-500">Country is required</span>
            )}
          </div>

          {/* Current Medications ( If Any ) */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              Current Medications ( If Any )
            </label>
            <input
              {...register("currentMedication", { required: false })}
              placeholder="Enter Here"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.currentMedication && (
              <span className="text-red-500">Country is required</span>
            )}
          </div>
          {/* Known Allergies ( If Any ) */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              Known Allergies ( If Any )
            </label>
            <input
              {...register("allergies", { required: false })}
              placeholder="Known Allergies Here"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.allergies && (
              <span className="text-red-500">Known Allergies is required</span>
            )}
          </div>
          {/* Reason for Medication */}
          <div className="flex gap-2 items-start flex-col">
            <label className="text-textPrimary font-nerisSemiBold">
              Reason for Medication
            </label>
            <input
              {...register("reasonforMedication", { required: true })}
              placeholder="Reason Here"
              type="text"
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.reasonforMedication && (
              <span className="text-red-500">
                Reason Medication is required
              </span>
            )}
          </div>
        </form>
      </div>
    );
  }
);

export default Step4;
