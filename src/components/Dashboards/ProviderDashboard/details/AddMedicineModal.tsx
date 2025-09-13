import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GetData, PostData } from "../../../../api/API";
import toast from "react-hot-toast";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { Select } from "antd";
import { PlusIconSvg } from "../../../../assets/svgContainer";
import { cn } from "../../../../lib/utils";
import { units } from "../../patientDashboard/rxSteps/Setp3";
import Loader from "../../../common/Loader";
import { DeleteOutlined } from "@ant-design/icons";

// Type definitions
type Medication = {
  displayName: string;
  quantity: number;
  dispenseUnitId: number | null;
  refills: string | number;
  daysSupply: number | null;
  id?: string;
  directions?: string;
  notes?: string;
};

type Inputs = {
  Refill: string;
  pharmacy: string;
  medications: Medication[];
};

interface PharmacyOption {
  value: string;
  label: string;
}

interface PrescriptionDetails {
  id: number;
  // Add other prescription details properties as needed
}

interface AddMedicineModalProps {
  id: number;
  setOpen: (open: boolean) => void;
  data: PrescriptionDetails;
}

interface MedicationResponse {
  Items?: Array<{
    NameWithRouteDoseForm: string;
    // Add other properties as needed
  }>;
}

const AddMedicineModal = ({
  id,
  setOpen,
  data: prescriptionData,
}: AddMedicineModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      medications: prescriptionData?.medications || [], // Initialize with existing meds
    },
  });

  const [storedMedicines, setStoredMedicines] = useState<Medication[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["medications", debouncedQuery],
    queryFn: () =>
      GetData<MedicationResponse>(`medication?name=${debouncedQuery}`),
    enabled: !!debouncedQuery,
  });
  const queryClient = useQueryClient();

  const UpdateMedications = useMutation({
    mutationKey: ["updateMedications"],
    mutationFn: (payload: Inputs) =>
      PostData(`prescription/${id}/medications`, payload, "put"),
    onSuccess: () => {
      toast.success(
        `Medication ${
          prescriptionData?.medications?.length ? "Updated" : "Added"
        } successfully`
      );
      setOpen(false);
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("prescription-details") ||
          query.queryKey.includes("medications"),
      });
      // Remove the reset() call here
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Use field array for dynamic medicine fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Step 2 form data:", data);
    UpdateMedications.mutate(data);
  };

  const handleAddMedicine = () => {
    if (!selectedPharmacy) return;

    // Check for duplicates in existing fields
    const isDuplicate = fields.some(
      (field) => field.displayName === selectedPharmacy
    );

    if (isDuplicate) {
      toast.error("This medicine has already been added!");
      return;
    }

    // Append new medicine with default values
    append({
      displayName: selectedPharmacy,
      quantity: 0,
      dispenseUnitId: null,
      refills: "",
      daysSupply: null,
    });

    // Clear the selection
    setValue("pharmacy", null);
  };

  // Add a remove medicine function
  const handleRemoveMedicine = (index: number) => {
    remove(index);
  };

  // Add this useEffect to sync form with latest prescriptionData
  useEffect(() => {
    if (prescriptionData?.medications) {
      reset({
        medications: prescriptionData?.medications,
        pharmacy: null, // Reset the search field
      });
    }
  }, [prescriptionData, reset]);

  console.log(storedMedicines);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-[60%] shadow-none">
      <div className="flex flex-col sm:gap-5 gap-2 items-center justify-center">
        <div className="flex items-center justify-center gap-2 w-full">
          <div className="flex flex-col h-full lg:w-1/2 w-full">
            <label className="text-textPrimary font-nerisSemiBold mb-2 text-nowrap md:text-base text-sm">
              Search or Add Medicine
            </label>
            <Controller
              control={control}
              name="pharmacy"
              // rules={{ required: "Please select or type a medicine" }}
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
        {fields?.length < 1 && <p className="pt-5">No medication found.</p>}
        <div className="flex flex-col items-start gap-5">
          {fields?.map((medicine, idx) => {
            return (
              <div
                key={medicine.id}
                className={cn(
                  "pb-8",
                  idx < fields.length - 1 && "border-gray-200 border-b"
                )}
              >
                <div className=" grid grid-cols-1 lg:grid-cols-2  gap-5">
                  {/* Medication */}
                  <div className="flex flex-col h-full w-full">
                    <label className="text-textPrimary font-nerisSemiBold mb-2 space-x-8">
                      Medication {idx + 1}{" "}
                      {fields?.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(idx)}
                          className=" text-red-500 hover:text-red-700"
                        >
                          <DeleteOutlined />
                        </button>
                      )}
                    </label>
                    <input
                      {...register(`medications.${idx}.displayName`, {
                        required: true,
                      })}
                      placeholder="Medication Name"
                      type="text"
                      readOnly
                      className="text-textSecondary cursor-not-allowed font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                    {errors.medications?.[idx]?.displayName && (
                      <span className="text-red-500 mt-2">
                        Medication Name is required
                      </span>
                    )}
                  </div>
                  {/* Quantity */}

                  <div className="flex flex-col h-full w-full">
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Quantity
                    </label>
                    <input
                      {...register(`medications.${idx}.quantity`, {
                        required: true,
                        // valueAsNumber: true,
                      })}
                      placeholder="Quantity"
                      type="number"
                      className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                    {errors.medications?.[idx]?.quantity && (
                      <span className="text-red-500 mt-2">
                        Quantity is required
                      </span>
                    )}
                  </div>
                </div>

                <div className=" grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  gap-5 mt-5 ">
                  {/* Unit */}
                  <div className="flex gap-2 items-start flex-col">
                    <label className="text-textPrimary font-nerisSemiBold">
                      Unit
                    </label>
                    <Controller
                      name={`medications.${idx}.dispenseUnitId`}
                      control={control}
                      rules={{
                        required: "Unit is required",
                        validate: (value) => value !== null,
                      }}
                      render={({ field }) => (
                        <div style={{ width: "100%" }}>
                          <Select
                            {...field}
                            options={units}
                            placeholder="Select Unit"
                            className="w-full !h-12"
                            value={
                              units.find((opt) => opt.value === field.value) ||
                              null
                            }
                            onChange={(_, option) =>
                              field.onChange(option?.value ?? null)
                            }
                            status={
                              errors.medications?.[idx]?.dispenseUnitId
                                ? "error"
                                : ""
                            }
                          />
                        </div>
                      )}
                    />
                    {errors.medications?.[idx]?.dispenseUnitId && (
                      <span className="text-red-500 mt-1">
                        {errors.medications[idx].dispenseUnitId?.message}
                      </span>
                    )}
                  </div>

                  {/* Refills */}
                  <div className="flex flex-col h-full w-full ">
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Refills
                    </label>
                    <input
                      {...register(`medications.${idx}.refills`, {
                        required: true,
                        valueAsNumber: true,
                      })}
                      placeholder="Refill"
                      type="number"
                      className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                    {errors.medications?.[idx]?.refills && (
                      <span className="text-red-500 mt-1">
                        Refills is required
                      </span>
                    )}
                  </div>

                  {/* Supply Days */}
                  <div className="flex flex-col h-full w-full ">
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Supply Days
                    </label>
                    <input
                      {...register(`medications.${idx}.daysSupply`, {
                        required: true,
                        valueAsNumber: true,
                      })}
                      placeholder="Supply Days"
                      type="number"
                      className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                    {errors.medications?.[idx]?.daysSupply && (
                      <span className="text-red-500 mt-1">
                        Supply Days is required
                      </span>
                    )}
                  </div>
                  {/* Direction */}
                  <div className="flex flex-col h-full w-full ">
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Direction
                    </label>
                    <input
                      {...register(`medications.${idx}.directions`, {
                        required: true,
                      })}
                      placeholder="Directions"
                      type="text"
                      className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                    {errors.medications?.[idx]?.directions && (
                      <span className="text-red-500 mt-1">
                        Direction is required
                      </span>
                    )}
                  </div>
                  {/* Notes */}
                  <div className="flex flex-col h-full w-full ">
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Notes
                    </label>
                    <input
                      {...register(`medications.${idx}.notes`, {
                        required: false,
                      })}
                      placeholder="Notes"
                      type="text"
                      className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] min-h-[48px]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {fields?.length > 0 && (
          <div className="flex items-center justify-center w-full">
            <button
              type="submit"
              className="mt-6 px-8 bg-primaryColor text-white p-2 rounded-md"
            >
              {UpdateMedications.isPending ? (
                <p>
                  <Loader />
                </p>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddMedicineModal;
