import { forwardRef, useContext, useImperativeHandle } from "react";
import moment, { type Moment } from "moment";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetData, PostData } from "../../../../api/API";
import { MainContext } from "../../../../provider/ContextProvider";
import toast from "react-hot-toast";

type Inputs = {
  FirstName: string;
  LastName: string;
  dob: Moment | null;
  gender: "male" | "female" | "other";
  Address1: string;
  Address2: string;
  State: string;
  City: string;
  Code: string;
  Country: string;
  Height: string;
  Weight: string;
  email: string;
  mobialNumber: number;
  CurrentMedication: string;
  Reason: string;
  Known: string;
  Requested: string;
  Store: number;
  StoreName: number;
  Phone: number;
  Address: number;
};

const Step5 = forwardRef(
  (
    { onNext }: { onNext: (data: Inputs) => void },
    ref: React.Ref<{ submit: () => Promise<boolean> }>
  ) => {
    const { handleSubmit, trigger } = useForm<Inputs>({
      mode: "onChange",
    });

    const knownAllergies = JSON.parse(localStorage.getItem("allergies") || "");
    const currentMedications = JSON.parse(
      localStorage.getItem("currentMedication") || ""
    );
    const reasonForMedications = JSON.parse(
      localStorage.getItem("reasonforMedication") || ""
    );

    const { data, isLoading, error } = useQuery({
      queryKey: ["patient-profile"],
      queryFn: () => GetData("patient/profile"),
    });
    const {
      data: pharmacyData,
      isLoading: pharmacyDataLoading,
      error: pharmacyDataError,
    } = useQuery({
      queryKey: ["pharmacy"],
      queryFn: () => GetData("pharmacy"),
    });

    const Payment = useMutation({
      mutationKey: ["payment"],
      mutationFn: (payload) =>
        PostData("payment/patient/payment-session", payload),
      onSuccess: (data) => {
        window.location.replace(data?.data?.url);
      },

      onError: () => {
        toast.error("Payment Failed. Try again.");
      },
    });

    const finalData = useMutation({
      mutationKey: ["final-data"],
      mutationFn: (payload) => PostData("prescription", payload),
      onSuccess: (data) => {
        toast.success(
          data?.response?.data?.message || "Prescription created successfully"
        );
        const res = data?.data?.prescription;
        const response = {
          prescriptionId: res?.id,
          patientId: res?.patientUserId,
          prescriptionType: res?.prescriptionType,
        };
        Payment.mutate(response);
      },
      onError: (err) => {
        console.log("err", err);
        toast.error(err?.response?.data?.message || "Something went wrong.");
      },
    });

    const { data: contextData } = useContext(MainContext);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("Step 5 form data:", data);
      // onNext(data);
      finalData.mutate(contextData);
    };

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const result = await trigger();
        console.log("Validation result:", result);

        if (result) {
          handleSubmit(onSubmit)();
        }
        return result;
      },
    }));

    const fullName = data?.firstName + data?.lastName;

    const medicineList = JSON.parse(
      localStorage.getItem("medicine_list") || "null"
    );

    return (
      <div className="p-6 bg-white">
        <p className="text-textPrimary font-nerisSemiBold text-2xl">
          Patient Information
        </p>

        <form>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-5 gap-y-3 bg-[#F2F8FF] rounded-2xl p-6 mt-5">
            {/* First Name */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Name
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]">
                {fullName || "N/A"}
              </p>
            </div>

            {/* Email */}
            <div className=" flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Email ID
              </label>

              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.email || "N/A"}
              </p>
            </div>

            {/* Date of Birth */}
            <div className="flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                Date of Birth
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.dateOfBirth
                  ? moment(data?.dateOfBirth).format("MM/DD/YYYY")
                  : "N/A"}
              </p>
            </div>

            {/* Gender */}
            <div className="flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                Gender
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.gender || "N/A"}
              </p>
            </div>
            {/* Height */}

            <div className="flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                Height (LB)
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.height || "N/A"}
              </p>
            </div>

            {/* Weight */}
            <div className="flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                Weight (IN)
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.weight || "N/A"}
              </p>
            </div>

            {/* Mobile */}
            <div className=" flex gap-2 items-start flex-col mt-3">
              <label className="text-textPrimary font-nerisSemiBold">
                Mobile Number
              </label>

              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.primaryPhone || "N/A"}
              </p>
            </div>
            <div></div>
            {/*  Address Line 1 */}
            <div className="flex gap-2 items-start flex-col mt-6">
              <label className="text-textPrimary font-nerisSemiBold">
                Address Line 1
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.address1 || "N/A"}
              </p>
            </div>
            {/*  Address Line 2 */}
            <div className="flex gap-2 items-start flex-col mt-6">
              <label className="text-textPrimary font-nerisSemiBold">
                Address Line 2
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.address2 || "N/A"}
              </p>
            </div>
            {/* State */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                State
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.state || "N/A"}
              </p>
            </div>
            {/*  City */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                City
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.city || "N/A"}
              </p>
            </div>
            {/* Post Code */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Postal Code
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.zipCode || "N/A"}
              </p>
            </div>
            {/* Country */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Country
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {data?.country || "N/A"}
              </p>
            </div>
          </div>

          <p className="text-textPrimary font-nerisSemiBold text-2xl my-5">
            Existing Conditions
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-5 gap-y-3 bg-[#F2F8FF] rounded-2xl p-6 mt-5">
            {/* Current Medications ( If Any ) */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Current Medications ( If Any )
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {currentMedications || "N/A"}
              </p>
            </div>
            {/* Known Allergies ( If Any ) */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Known Allergies ( If Any )
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {knownAllergies || "N/A"}
              </p>
            </div>
            {/* Reason for Medication */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Reason for Medication
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {reasonForMedications || "N/A"}
              </p>
            </div>
          </div>

          <p className="text-textPrimary font-nerisSemiBold text-2xl my-5">
            Requested Medicines
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-5 gap-y-3 bg-[#F2F8FF] rounded-2xl p-6 mt-5">
            {/* Reason for Medication */}
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Requested Medicine
              </label>
              {medicineList?.map((data, idx) => (
                <p
                  key={idx}
                  className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] "
                >
                  {data}
                </p>
              ))}
            </div>
          </div>

          <p className="text-textPrimary font-nerisSemiBold text-2xl my-5">
            Pharmacy Details
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-x-5 gap-y-3 bg-[#F2F8FF] rounded-2xl p-6 mt-5">
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Store Name
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {pharmacyData?.storeName || "N/A"}
              </p>
            </div>

            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Phone
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {pharmacyData?.primaryPhone || "N/A"}
              </p>
            </div>

            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Address
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {pharmacyData?.address1 || "N/A"}
              </p>
            </div>
            <div className="flex gap-2 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                State Code
              </label>
              <p className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-[#FCFCFC] rounded-md px-4 py-3 w-full focus:outline-[#1677ff] ">
                {pharmacyData?.state || "N/A"}
              </p>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default Step5;
