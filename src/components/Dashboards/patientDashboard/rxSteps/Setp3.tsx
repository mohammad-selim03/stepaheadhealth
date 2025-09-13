import { Select } from "antd";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { MainContext } from "../../../../provider/ContextProvider";
import { cn } from "../../../../lib/utils";

type Inputs = {
  displayName: string;
  quantity: number;
  dispenseUnitId: number | null;
  refills: string;
  daysSupply: number | null | undefined;
};

export const units = [
  {
    label: "Applicator",
    value: 35,
  },
  {
    label: "Blister",
    value: 39,
  },
  {
    label: "Caplet",
    value: 44,
  },
  {
    label: "Capsule",
    value: 4,
  },
  {
    label: "Each",
    value: 32,
  },
  {
    label: "Film",
    value: 52,
  },
  {
    label: "Gram",
    value: 8,
  },
  {
    label: "Gum",
    value: 33,
  },
  {
    label: "Implant",
    value: 54,
  },
  {
    label: "Insert",
    value: 57,
  },
  {
    label: "Kit",
    value: 11,
  },
  {
    label: "Lancet",
    value: 90,
  },
  {
    label: "Lozenge",
    value: 13,
  },
  {
    label: "Milliliter",
    value: 15,
  },
  {
    label: "Packet",
    value: 21,
  },
  {
    label: "Pad",
    value: 64,
  },
  {
    label: "Patch",
    value: 28,
  },
  {
    label: "Pen Needle",
    value: 83,
  },
  {
    label: "Ring",
    value: 70,
  },
  {
    label: "Sponge",
    value: 73,
  },
  {
    label: "Stick",
    value: 75,
  },
  {
    label: "Strip",
    value: 76,
  },
  {
    label: "Suppository",
    value: 23,
  },
  {
    label: "Swab",
    value: 77,
  },
  {
    label: "Tablet",
    value: 26,
  },
  {
    label: "Troche",
    value: 81,
  },
  {
    label: "Unspecified",
    value: 19,
  },
  {
    label: "Wafer",
    value: 82,
  },
];
type Medicine = {
  displayName: string;
  quantity: number;
  dispenseUnitId: number | null;
  refills: string;
  daysSupply: number | null;
};

const Step3 = forwardRef(
  (
    { onNext }: { onNext: (data: Inputs) => void },
    ref: React.Ref<{ submit: () => void }>
  ) => {
    const { setData } = useContext(MainContext);

    const storedMedicines: string[] = JSON.parse(
      localStorage.getItem("medicine_list") || "[]"
    );

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{ medications: Medicine[] }>({
      defaultValues: {
        medications: [],
      },
    });

    const { fields, append } = useFieldArray({
      control,
      name: "medications",
    });

    const initialized = useRef(false);

    useEffect(() => {
      if (initialized.current) return;
      initialized.current = true;

      const newItems = storedMedicines.map((name) => ({
        displayName: name,
        quantity: 0,
        dispenseUnitId: null,
        refills: "",
        daysSupply: null,
      }));

      append(newItems);
    }, [append, storedMedicines]);

    const onSubmit: SubmitHandler<{ medications: Medicine[] }> = (data) => {
      console.log("Final medications data:", data.medications);
      onNext(data.medications);
      setData({ medications: data?.medications });
    };

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
    }));

    return (
      <div className="p-6 bg-white">
        <p className="text-textPrimary font-nerisSemiBold lg:text-2xl md:text-xl text-base">
          Refill Information
        </p>
        <form className=" bg-[#F2F8FF] rounded-2xl p-6 mt-10 flex flex-col gap-5">
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
                    <label className="text-textPrimary font-nerisSemiBold mb-2">
                      Medication {idx + 1}
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
                      placeholder="Enter Refill"
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
                </div>
              </div>
            );
          })}
        </form>
      </div>
    );
  }
);

export default Step3;
