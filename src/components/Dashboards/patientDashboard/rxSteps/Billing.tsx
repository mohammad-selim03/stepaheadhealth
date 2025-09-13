import { Button } from "antd";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  MasterCardSvg,
  PlusBuleSvg,
  StripeSvg,
} from "../../../../assets/svgContainer";
import toast, { Toaster } from "react-hot-toast";

type Inputs = {
  FirstName: string;
  LastName: string;
  mobialNumber: number;
};

const Billing = () => {
    const nagigator=useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {console.log(data);
   toast.success("Your payment was successful!");
    reset();
    nagigator("/patient-dashboard");

  }

  return (
    <div>
        <Toaster/>
      <div className=" flex justify-between items-center pr-5 mb-10">
        <p className="text-textPrimary font-nerisSemiBold md:text-[32px] xm:text-2xl text-base text-nowrap">
          Billing Information
        </p>
        <Link to="/patient-dashboard">
          <Button className="!bg-white md:!h-10 sm:!h-8 !h-6 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105 md:!px-15 !px-5">
            Cancel
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-2 sm:p-6">
        <p className="font-nerisSemiBold md:text-2xl sm:text-xl text-base text-textPrimary mb-6">
          Patient Information
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 bg-[#F2F8FF] rounded-2xl p-6">
            {/* First Name */}
            <div className="flex gap-4 items-start flex-col ">
              <label className="text-textPrimary font-nerisSemiBold">
                First Name
              </label>
              <input
                {...register("FirstName", { required: true })}
                placeholder="Enter First Name Here"
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.FirstName && (
                <span className="text-red-500">First Name is required</span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex gap-4 items-start flex-col">
              <label className="text-textPrimary font-nerisSemiBold">
                Last Name
              </label>
              <input
                {...register("LastName", { required: true })}
                placeholder="Enter Last Name Here"
                type="text"
                className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
              />
              {errors.LastName && (
                <span className="text-red-500">Last Name is required</span>
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
                {...register("mobialNumber", { required: true })}
              />
              {errors.mobialNumber && (
                <span className="text-red-500">Mobile number is required</span>
              )}
            </div>

            <div> </div>
          </div>

          <p className="font-nerisSemiBold  md:text-2xl sm:text-xl text-base text-textPrimary my-6">
            Select Payment Method
          </p>

          <div className=" bg-[#F2F8FF] rounded-2xl p-6 space-y-6">
            <label className=" flex items-center justify-between bg-white rounded-2xl py-2 px-6 cursor-pointer">
              <div className=" flex gap-4 items-center">
                <MasterCardSvg />
                <div>
                  <p className="font-nerisSemiBold text-textPrimary text-nowrap text-sm sm:text-base">
                    MasterCard
                  </p>
                  <p className="font-Poppins text-sm  text-textSecondary font-light text-nowrap">
                    **** ****73
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 sm:gap-4 items-center">
                <StripeSvg />
                <input type="radio" name="option" className="peer hidden" />
                <div className="w-5 h-5 rounded-full border-2 border-[#195B91] peer-checked:border-[#195B91] peer-checked:bg-[#195B91] transition"></div>
              </div>
            </label>

            <label className=" flex items-center justify-between bg-white rounded-2xl py-2 px-6 cursor-pointer">
              <div className=" flex gap-4 items-center">
                <MasterCardSvg />
                <div>
                  <p className="font-nerisSemiBold text-textPrimary text-sm sm:text-base">
                    MasterCard
                  </p>
                  <p className="font-Poppins text-sm  text-textSecondary font-light">
                    **** ****73
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 sm:gap-4 items-center">
                <StripeSvg />
                <input type="radio" name="option" className="peer hidden" />
                <div className="w-5 h-5 rounded-full border-2 border-[#195B91] peer-checked:border-[#195B91] peer-checked:bg-[#195B91] transition"></div>
              </div>
            </label>

            <label className=" flex items-center justify-between bg-white rounded-2xl py-2 px-6 cursor-pointer">
              <div className=" flex  gap-4 items-center">
                <MasterCardSvg />
                <div>
                  <p className="font-nerisSemiBold text-textPrimary text-sm sm:text-base">
                    MasterCard
                  </p>
                  <p className="font-Poppins text-sm  text-textSecondary font-light">
                    **** ****73
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 sm:gap-4 items-center">
                <StripeSvg />
                <input type="radio" name="option" className="peer hidden" />
                <div className="w-5 h-5 rounded-full border-2 border-[#195B91] peer-checked:border-[#195B91] peer-checked:bg-[#195B91] transition"></div>
              </div>
            </label>
            <Button className="!bg-white !h-10 !rounded-md !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-100 w-full group">
              <div className=" group-hover:text-white text-primaryColor">
                <PlusBuleSvg />
              </div>
              Add new card
            </Button>
          </div>

          <p className="font-nerisSemiBold  md:text-2xl sm:text-xl text-base text-textPrimary my-6">
            Billing Summary
          </p>

          <div className=" flex items-center justify-between sm:text-base text-sm">
            <p className="text-textPrimary font-nerisSemiBold "> Item</p>
            <p className="text-textSecondary font-nerisSemiBold ">
              Provider fees
            </p>
          </div>

          <hr className="border border-[#D0DAE2] my-3" />

          <div className=" flex items-center justify-between mb-3 sm:text-base text-sm">
            <p className="text-textPrimary font-nerisSemiBold "> Date</p>
            <p className="text-textSecondary font-nerisSemiBold ">
              May 26, 2025
            </p>
          </div>

          <hr className="border border-[#D0DAE2] my-3" />

          <div className=" flex items-center justify-between mb-3 sm:text-base text-sm">
            <p className="text-textPrimary font-nerisSemiBold ">
              Provider fees
            </p>
            <p className="text-textSecondary font-nerisSemiBold ">$55.00 USD</p>
          </div>
          <hr className="border border-[#D0DAE2] my-3" />
          <div className=" flex items-center justify-between mb-3 sm:text-base text-sm">
            <p className="text-textPrimary font-nerisSemiBold ">
              Processing Fees
            </p>
            <p className="text-textSecondary font-nerisSemiBold ">$12.88 USD</p>
          </div>
          <hr className="border border-[#D0DAE2] my-3" />
          <p className="text-textSecondary font-Poppins text-sm">
            Note: Please check the provider refund policy.
          </p>
          <hr className="border border-[#D0DAE2] my-3" />

          <div className=" flex items-center justify-between mb-3 sm:text-base text-sm">
            <p className="text-primaryColor font-nerisSemiBold ">
              Total Payable
            </p>
            <p className="text-primaryColor font-nerisSemiBold ">$55 USD</p>
          </div>

          <div className=" flex justify-center mt-10">
            <Button
              htmlType="submit"
              className="!bg-primaryColor md:!h-12 sm:!h-10 !h-8 !rounded-xl !font-nerisSemiBold !border-primaryColor !text-white hover:!bg-white !transition-all !duration-300 hover:!text-primaryColor hover:!scale-105  !px-15"
            >
              Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Billing;
