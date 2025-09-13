import { useTranslation } from "react-i18next";

const CartSection = () => {
  const { t } = useTranslation("patientdashboard");
  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3 p-3 rounded-xl">
        <p className="font-nerisSemiBold md:text-3xl sm:text-xl text-base">
          {t("paymentAndReceiptsLabel")}
        </p>
      </div>
      {/* cards */}
      {/* <div className="flex flex-col lg:flex-row items-center gap-5">
        <div className="max-w-90 w-full p-6 flex flex-col gap-3 border bg-white border-[#E5E5E5] rounded-xl hover:bg-primaryColor hover:text-white transition-all duration-300 group">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.PaymentBlue1} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.PaymentWhite1} />
          </div>

          <div className="flex gap-2 ">
            <p className="text-nowrap font-Poppins md:text-lg text-base font-light text-textSecondary mt-0.5 md:mt-1 group-hover:text-white">
              Outstanding Charges
            </p>
            <p className="text-textPrimary font-nerisSemiBold md:text-2xl sm:text-xl text-base group-hover:text-white">
              $120
            </p>
          </div>
        </div>

        <div className=" max-w-90 w-full  p-6 flex flex-col gap-3 border bg-white border-[#E5E5E5] rounded-xl hover:bg-primaryColor hover:text-white transition-all duration-300 group">
          <div className="bg-white group-hover:block hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.PaymentBule} />
          </div>

          <div className="bg-primaryColor group-hover:hidden transition-all duration-300 p-3 rounded-xl w-fit">
            <img src={imageProvider.PaymentWhite} />
          </div>

          <div className="flex gap-2 ">
            <p className=" text-nowrap font-Poppins md:text-lg text-base font-light text-textSecondary  mt-0.5 md:mt-1  group-hover:text-white">
              Last Payment Made
            </p>
            <p className="text-textPrimary font-nerisSemiBold md:text-2xl sm:text-xl text-base group-hover:text-white">
              $80
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CartSection;
