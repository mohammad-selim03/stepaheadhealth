import { Button, DatePicker, Select } from "antd";
import moment, { type Moment } from "moment";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../../components/common/Loader";
import { useNavigate } from "react-router";

type Inputs = {
  FirstName: string;
  LastName: string;
  HomeAddress: string;
  City: string;
  State: string;
  ZipCode: string;
  DateOfBirth: Moment | null;
  SocialSecurityNumber: string;
  CreditCardNumber: string;
  PhoneNumber: string;
  IsMobileNumber: string; // "True" or "False"
};

const IdpInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clinician-profile"],
    queryFn: () => GetData("clinician/profile"),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      FirstName: "",
      LastName: "",
      HomeAddress: "",
      City: "",
      State: "",
      ZipCode: "",
      DateOfBirth: null,
      SocialSecurityNumber: "",
      CreditCardNumber: "",
      PhoneNumber: "",
      IsMobileNumber: "True",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        FirstName: data?.firstName || "",
        LastName: data?.lastName || "",
        City: data?.city || "",
        State: data?.state || "",
        ZipCode: data?.zipCode || "",
        HomeAddress: data?.address1 || "",
        DateOfBirth: data?.dateOfBirth ? moment(data?.dateOfBirth) : null,
        SocialSecurityNumber: data?.SocialSecurityNumber || "",
        CreditCardNumber: data?.CreditCardNumber || "",
        PhoneNumber: data?.primaryPhone || "",
        IsMobileNumber: data?.IsMobileNumber || "True",
      });
    }
  }, [data, reset]);

  const navigate = useNavigate();

  const Send = useMutation({
    mutationKey: ["send"],
    mutationFn: (payload) =>
      PostData(`idp/clinician-info/${data?.dosespotId}`, payload),
    onSuccess: () => {
      toast.success("Clinician IDP info submitted successfully");
      reset();
      navigate("/idp/mail-confirmation");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
      // navigate("/idp/verification");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    const payload = {
      ...formData,
      DateOfBirth: formData.DateOfBirth
        ? moment(formData.DateOfBirth).format("MM-DD-YYYY")
        : "",
    };
    console.log(payload);
    Send.mutate(payload);
  };

  return (
    <div className="py-10 max-w-5xl px-5 mx-auto  bg-[#F2F8FF] p-5 rounded-xl">
      <p className="text-2xl font-semibold pb-3">IDP Verification</p>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 gap-x-5 gap-y-1"
      >
        {/* First Name */}
        <div className="flex flex-col mt-6">
          <label className="font-semibold">First Name</label>
          <input
            {...register("FirstName")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col mt-6">
          <label className="font-semibold">Last Name</label>
          <input
            {...register("LastName")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>
        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="font-semibold">Phone Number</label>
          <input
            {...register("PhoneNumber")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>
        {/* Home Address */}
        <div className="flex flex-col">
          <label className="font-semibold">Home Address</label>
          <input
            {...register("HomeAddress")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>
        {/* City */}
        <div className="flex flex-col">
          <label className="font-semibold">City</label>
          <input
            {...register("City")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>

        {/* State */}
        <div className="flex flex-col">
          <label className="font-semibold">State</label>
          <input
            {...register("State")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>

        {/* Zip Code */}
        <div className="flex flex-col">
          <label className="font-semibold">Zip Code</label>
          <input
            {...register("ZipCode")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div>
        {/* Date of Birth */}
        <div className="flex flex-col">
          <label className="font-semibold">Date of Birth</label>
          <Controller
            name="DateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                // disabled
                value={field.value}
                format="MM-DD-YYYY"
                className="w-full !py-3 bg-white"
              />
            )}
          />
        </div>
        {/* Phone Number
        <div className="flex flex-col mt-3">
          <label className="font-semibold">Primay Fax</label>
          <input
            {...register("Pri")}
        
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-200 outline-0"
          />
        </div> */}

        {/* Social Security Number (editable) */}
        <div className="flex flex-col">
          <label className="font-semibold">Social Security Number</label>
          <input
            {...register("SocialSecurityNumber", {
              required: true,
              minLength: { value: 9, message: "Must be 9  digits" },
            })}
            className="px-4 py-3 rounded-md w-full bg-white border border-gray-200 outline-0"
          />
          {errors.SocialSecurityNumber && (
            <span className="text-red-500">
              {errors?.SocialSecurityNumber?.message}
            </span>
          )}
        </div>

        {/* Credit Card Number (editable) */}
        <div className="flex flex-col">
          <label className="font-semibold">Credit Card Number</label>
          <input
            {...register("CreditCardNumber", { required: true })}
            className="px-4 py-3 rounded-md w-full bg-white border border-gray-200 outline-0"
          />
          {errors.CreditCardNumber && (
            <span className="text-red-500">
              {errors?.CreditCardNumber?.message}
            </span>
          )}
        </div>

        <Button
          htmlType="submit"
          className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-semibold lg:!col-span-2 !w-fit !mx-auto !px-10 !mt-8"
        >
          {Send.isPending ? <Loader /> : <> Continue</>}
        </Button>
      </form>
    </div>
  );
};

export default IdpInfo;
