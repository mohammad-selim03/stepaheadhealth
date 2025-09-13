import { useTranslation } from "react-i18next";
import Container from "../../components/shared/Container";
import { imageProvider } from "../../lib/imageProvider";
import { LocationSvg } from "../../assets/svgContainer";
import { MailFilled, PhoneOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "../../api/API";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

interface contactFromData {
  name: string;
  email: string;
  emailSubject: string;
  emailMessage: string;
}

const Contacts = () => {
  const { t } = useTranslation("contact");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<contactFromData>();
  const Submit = useMutation({
    mutationKey: ["contact"],
    mutationFn: (payload) => PostData("cms/send-email", payload),
    onSuccess: () => {
      toast.success("Message Send");
      reset()
    },
    onError: () => {
      toast.error(error?.response?.data?.message || "Message Send failed");
    },
  });



  const onSubmit = (data: contactFromData) => {
    console.log("data", data);
    Submit.mutate(data);
  };

  return (
    <Container>
      <div className="flex flex-col-reverse md:flex-row 2xl:flex-none items-start gap-5 py-10 lg:py-20 w-full">
        <div className="w-full lg:md-w-1/2">
          <div className="flex flex-wrap 3xl:flex-nowrap items-center gap-5 w-full">
            <img
              src={imageProvider.authorImg1}
              alt="Author image 1"
              className="rounded-xl w-full max-w-full md:max-w-[340px] h-auto sm:h-[373px] object-cover"
            />
            <img
              src={imageProvider.authorImg2}
              alt="Author image 2"
              className="rounded-xl w-full max-w-full md:max-w-[340px] h-auto sm:h-[373px] object-cover"
            />
          </div>
          <div className="py-5">
            <div className="bg-primaryColor p-5 rounded-xl py-5 font-nerisLight">
              <p className="text-2xl font-semibold text-center text-white ">
                StepAhead Health
              </p>
              <div className="py-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center justify-center gap-5">
                <div className="bg-white p-8 rounded-xl w-full flex flex-col items-center justify-center gap-2">
                  <p className="bg-primaryColor p-3 rounded-full w-fit">
                    <LocationSvg />
                  </p>
                  <p className="font-Poppins font-light text-textSecondary">
                    {t("contact")}
                  </p>
                  <p>+1-(678)-820-2221</p>
                </div>
                <div className="bg-white p-8 rounded-xl w-full flex flex-col items-center justify-center gap-2">
                  <p className="bg-primaryColor px-3.5 py-3 rounded-full w-fit">
                    <PhoneOutlined className="!text-white text-xl" />
                  </p>
                  <p className="font-Poppins font-light text-textSecondary">
                    {t("toll_free")}
                  </p>
                  <p>+1-(855)-725-7629</p>
                </div>
                <div className="bg-white p-5 rounded-xl w-full flex flex-col items-center justify-center gap-2 ">
                  <p className="bg-primaryColor p-3 rounded-full w-fit">
                    <MailFilled className="!text-white text-xl" />
                  </p>
                  <p className="font-Poppins font-light text-textSecondary">
                    {t("email")}
                  </p>
                  <p className="flex items-center justify-center text-center">
                    support@stepahead
                    <br />
                    health.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border border-primaryColor rounded-2xl bg-white w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-[32px] font-nerisSemiBold">{t("title")}</h3>
            {/* <p className="font-Poppins font-light">
              Community Living and Support Services in Houston, Texas
            </p> */}
            <div className="flex flex-col items-start gap-5 w-full py-5 font-nerisLight">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="name" className="font-medium">
                  {t("name")}
                </label>
                <input
                  {...register("name", { required: t("name_required") })}
                  type="text"
                  className="px-3 py-3 rounded-xl border border-gray-300 w-full"
                  placeholder={t("name_placeholder")}
                />
                {errors?.name && (
                  <p className="text-red-500">{errors?.name?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email" className="font-medium">
                  {t("email")}
                </label>
                <input
                  {...register("email", { required: t("email_required") })}
                  type="email"
                  className="px-3 py-3 rounded-xl border border-gray-300 w-full"
                  placeholder={t("email_placeholder")}
                />
                {errors?.email && (
                  <p className="text-red-500">{errors?.email?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="subject" className="font-medium">
                  {t("subject")}
                </label>
                <input
                  {...register("emailSubject", {
                    required: t("subject_required"),
                  })}
                  type="text"
                  className="px-3 py-3 rounded-xl border border-gray-300 w-full"
                  placeholder={t("subject_placeholder")}
                />
                {errors?.emailSubject && (
                  <p className="text-red-500">{errors?.emailSubject?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="name" className="font-medium">
                  {t("message")}
                </label>
                <textarea
                  {...register("emailMessage", {
                    required: t("message_required"),
                  })}
                  className="px-3 py-3 rounded-xl border border-gray-300 w-full resize-none h-40"
                  placeholder={t("message_placeholder")}
                />
                {errors?.emailMessage && (
                  <p className="text-red-500">{errors?.emailMessage?.message}</p>
                )}
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <button
                type="submit"
                className="!bg-primaryColor !px-5 !h-10 !text-white !rounded-xl"
              >
                {Submit?.isPending ? <Loader /> : t("send_button")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Contacts;
