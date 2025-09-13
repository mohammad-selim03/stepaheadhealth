import { useMutation, useQuery } from "@tanstack/react-query";
import { forwardRef, useContext, useImperativeHandle } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../common/Loader";
import { MainContext } from "../../../../provider/ContextProvider";
import toast from "react-hot-toast";
import { Button } from "antd";
import { useNavigate } from "react-router";

type Inputs = {
  [key: string]: boolean | null;
};

interface MedicalCondition {
  id: string;
  name: string;
}

interface Step4Props {
  onNext: (data: { medicalPreConditions: string[] }) => void;
  goBack: () => void;
}

interface Step4Ref {
  submit: () => void;
}

const Step4 = forwardRef<Step4Ref, Step4Props>(({ onNext, goBack }, ref) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigator = useNavigate();

  const { data, isLoading, error } = useQuery<MedicalCondition[]>({
    queryKey: ["medical_pre_conditions"],
    queryFn: () => GetData("medical-pre-condition"),
  });

  const { data: contextData, setData, setStep } = useContext(MainContext);

  const dataSubmit = useMutation({
    mutationKey: ["patient-profile"],
    mutationFn: (payload: unknown) => PostData("patient/profile", payload),
    onSuccess: (data: { message?: string }) => {
      toast.success(data?.message || "Profile created");
      localStorage.setItem("is_profile_created", JSON.stringify(true));
      navigator("/image-upload");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (rawData) => {
    const selectedConditions =
      data
        ?.filter((condition) => rawData[condition.name])
        .map((condition) => condition.name) || [];

    const updatedData = {
      ...contextData,
      medicalPreConditions: selectedConditions,
    };

    onNext({ medicalPreConditions: selectedConditions });

    setData(updatedData);

    // Submit the complete form data
    dataSubmit.mutate(updatedData);
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  const handleDone = () => {
    dataSubmit.mutate(contextData);
  };

  return (
    <div className="">
      <p className="text-textPrimary font-nerisSemiBold lg:text-3xl text-xl mb-5">
        Medical Pre-Conditions{" "}
        <span className="text-textSecondary font-Poppins font-light">
          (Optional)
        </span>
      </p>
      {
        <form className="grid lg:grid-cols-2 gap-x-5 gap-y-6">
          {data?.map((condition) => {
            return isLoading ? (
              <p className="flex items-center justify-center h-96">
                <Loader color="#195b91" />
              </p>
            ) : error ? (
              <p>Something went wrong, Try again</p>
            ) : (
              <label
                key={condition.id}
                htmlFor={condition.id}
                className="cursor-pointer text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white flex items-center justify-between px-5 py-3 rounded-md"
              >
                <span className="text-textPrimary font-nerisSemiBold">
                  {condition.name}
                </span>
                <input
                  type="checkbox"
                  id={condition.id}
                  {...register(condition.name)}
                  className="w-5 h-5"
                />
              </label>
            );
          })}

          <div className="md:flex-row gap-5 items-center flex flex-col">
            <Button
              onClick={goBack}
              className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
            >
              Previous
            </Button>
            <Button
              type="primary"
              onClick={handleDone}
              className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
              loading={dataSubmit.isPending}
            >
              Done
            </Button>
          </div>
        </form>
      }
    </div>
  );
});

Step4.displayName = "Step4";

export default Step4;
