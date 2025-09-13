import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { PlusIconSvg } from "../../../../assets/svgContainer";
import { MainContext } from "../../../../provider/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import { Select } from "antd";
import toast from "react-hot-toast";

type Inputs = {
  Refill: string;
  pharmacy: string;
};

interface PharmacyOption {
  value: string;
  label: string;
}

const Step2 = forwardRef(
  (
    { onNext }: { onNext: (data: Inputs) => void },
    ref: React.Ref<{ submit: () => void }>
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [medicineList, setMedicineList] = useState<string[]>([]);
    console.log("med list", medicineList);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 1000);

      return () => clearTimeout(handler);
    }, [searchQuery]);

    const {
      register,
      handleSubmit,
      control,
      setValue,
      watch,
      trigger,
      formState: { errors },
    } = useForm<Inputs>();

    const { setStep } = useContext(MainContext);

    const { data, isLoading } = useQuery({
      queryKey: ["medications", debouncedQuery],
      queryFn: () => GetData(`medication?name=${debouncedQuery}`),
      enabled: !!debouncedQuery,
    });

    const pharmacyOptions: PharmacyOption[] =
      data?.Items?.map((p: any) => ({
        value:
          p?.NameWithRouteDoseForm +
          " " +
          (p?.Strength !== null ? "-" + " " + p?.Strength : ""),
        label:
          p?.NameWithRouteDoseForm +
          " " +
          (p?.Strength !== null ? "-" + " " + p?.Strength : ""),
      })) || [];

    const selectedPharmacy = watch("pharmacy");
    const [refillText, setRefillText] = useState("");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log("Step 2 form data:", data);
      onNext(data);
    };

    const handleAddMedicine = () => {
      if (!selectedPharmacy) return;
      const existingMedicines = refillText ? refillText.split("\n") : [];

      if (existingMedicines.includes(selectedPharmacy)) {
        toast.error("Duplicate medicine captured.!");
        return;
      }

      const updated = refillText
        ? `${refillText}\n${selectedPharmacy}`
        : selectedPharmacy;

      setRefillText(updated);
      setValue("Refill", updated, { shouldValidate: true });
      trigger("Refill");

      // Add to array state
      setMedicineList((prev) => [...prev, selectedPharmacy]);
    };
    useEffect(() => {
      localStorage.setItem("medicine_list", JSON.stringify(medicineList));
    }, [handleAddMedicine]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <div className="sm:p-6 p-3 bg-white">
        <p className="text-textPrimary font-nerisSemiBold lg:text-2xl md:text-xl text-base">
          Choose Medicines
        </p>
        <form className=" bg-[#F2F8FF] rounded-2xl sm:p-6 p-3 mt-10">
          <div className="flex sm:gap-5 gap-2 items-center">
            <div className="flex flex-col h-full lg:w-1/2 w-full">
              <label className="text-textPrimary font-nerisSemiBold mb-2 text-nowrap md:text-base text-sm">
                Search or Add Medicine
              </label>
              <Controller
                control={control}
                name="pharmacy"
                rules={{ required: "Please select or type a medicine" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={pharmacyOptions}
                    placeholder="Select or Type Medicine"
                    className="!h-12 !ring-0 !outline-0 !border-0 !hover:ring-0"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    loading={isLoading}
                    onSearch={(value) => {
                      setSearchQuery(value);
                    }}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value ?? null}
                  />
                )}
              />
              {errors.pharmacy && (
                <span className="text-red-500 mt-2">
                  {errors.pharmacy.message}
                </span>
              )}
            </div>
            <div
              className="bg-primaryColor py-3 sm:px-4 px-3 rounded-2xl cursor-pointer mt-8"
              onClick={handleAddMedicine}
            >
              <PlusIconSvg />
            </div>
          </div>

          <div className="flex flex-col h-full mt-5">
            <label className="text-textPrimary font-nerisSemiBold mb-2 md:text-base text-sm">
              RX Refill List
            </label>
            <textarea
              {...register("Refill", { required: true })}
              value={refillText}
              readOnly
              placeholder="RX Refill"
              rows={5}
              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
            />
            {errors.Refill && (
              <span className="text-red-500 mt-2">
                RX Refill List is required
              </span>
            )}
          </div>
        </form>
      </div>
    );
  }
);

export default Step2;
