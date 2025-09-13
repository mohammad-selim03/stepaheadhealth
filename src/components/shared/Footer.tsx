import { Link, useNavigate } from "react-router";
import {
  CallSvg,
  FacebookSvg,
  InstragramSvg,
  MailSvg,
  TiktokSvg,
} from "../../assets/svgContainer";
import { imageProvider } from "../../lib/imageProvider";
import Container from "./Container";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../api/API";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = (role) => {
    if (role === "c") {
      localStorage.setItem("role", JSON.stringify("Clinician"));
      navigate("/signup");
    } else {
      localStorage.setItem("role", JSON.stringify("Patient"));
      navigate("/signup");
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["footer"],
    queryFn: () => GetData("cms/platform-social-links"),
  });

  return (
    <div className="bg-primaryColor pt-18 pb-6">
      <Container>
        <div className=" lg:flex justify-between gap-10 space-y-10 lg:space-y-0">
          <div className=" overflow-hidden">
            <img
              className="lg:w-[265px] lg:h-[62px] w-[200px]   object-cover space-y-6"
              src={imageProvider.headerlogo}
            />
            <p className="text-white font-nerisLight lg:text-base text-sm mt-6">
              {t("footer.surescripts")}
            </p>
            <div>
              <p className="font-nerisSemiBold lg:text-lg text-base text-white mt-14">
                {t("footer.certifiedBy")}
              </p>
              <div className="flex gap-6 items-center">
                <img
                  className="w-[124px] h-[42px] object-cover"
                  src={imageProvider.Certifi1}
                />
                <a href="https://www.legitscript.com/" target="_blank">
                  <img
                    className="w-[72px] h-[78px] object-cover"
                    src="https://static.legitscript.com/seals/16924705.png"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="sm:flex justify-between gap-5 xl:gap-20 ">
            {/* Userful Links */}
            <div>
              <p className="font-nerisSemiBold  lg:text-lg text-base text-white mb-4">
                {t("footer.usefulLinks")}
              </p>
              <div className="flex gap-3 flex-col font-nerisLight  lg:text-base text-sm text-white">
                <button
                  onClick={() => handleNavigate("c")}
                  className=" hover:text-white/80 duration-300 md:text-nowrap"
                >
                  {t("footer.createProviderAccount")}
                </button>
                <button
                  onClick={() => handleNavigate("p")}
                  className=" hover:text-white/80 duration-300 -ml-2"
                >
                  {t("footer.createPatientAccount")}
                </button>
                <Link to="/login" className=" hover:text-white/80 duration-300">
                  {t("footer.login")}
                </Link>
                <Link
                  to="/terms-services"
                  className=" hover:text-white/80 duration-300"
                >
                  {t("footer.termsOfService")}
                </Link>
              </div>
              <div className=" flex gap-4 items-center mt-5">
                <a
                  target="_blank"
                  href={data?.instagram}
                  className="bg-white rounded-md px-2 py-2  hover:scale-105 duration-300"
                >
                  <InstragramSvg />
                </a>
                <a
                  target="_blank"
                  href={data?.facebook}
                  className="bg-white rounded-md px-2 py-2  hover:scale-105 duration-300"
                >
                  <FacebookSvg />
                </a>
                <a
                  target="_blank"
                  href={data?.tiktok}
                  className="bg-white rounded-md px-2 py-2  hover:scale-105 duration-300"
                >
                  <TiktokSvg />
                </a>
              </div>
            </div>

            {/* Get To Know Us */}
            <div className="hidden 2xl:block">
              <p className="font-nerisSemiBold text-lg text-white mb-4">
                {t("footer.getInTouch")}
              </p>
              <div className=" flex gap-3 flex-col">
                <Link
                  to="/about"
                  className="font-nerisLight text-base text-white  hover:text-white/80 duration-300"
                >
                  {t("footer.aboutUs")}
                </Link>
                {/* <Link
                  to="/"
                  className="font-nerisLight text-base text-white  hover:text-white/80 duration-300"
                >
                  {t("footer.howItWorks")}
                </Link> */}
              </div>
            </div>

            {/* Contact */}
            <div className=" space-y-3 hidden 2xl:block">
              <p className="font-nerisSemiBold text-lg text-white mb-4">
                {t("footer.contact")}
              </p>
              <div className="cursor-pointer flex gap-2 items-center">
                <CallSvg />
                <p className="font-nerisLight text-base text-white  hover:text-white/80 duration-300">
                  {t("footer.tollFree")}
                </p>
              </div>
              <div className="cursor-pointer flex gap-2 items-center">
                <CallSvg />
                <p className="font-nerisLight text-base text-white  hover:text-white/80 duration-300">
                  {t("footer.phone")}
                </p>
              </div>
              <div className="cursor-pointer flex gap-2 items-center ">
                <MailSvg />
                <p className="font-nerisLight text-base text-white hover:text-white/80 duration-300">
                  {t("footer.email")}
                </p>
              </div>
            </div>

            <div className="2xl:hidden space-y-5 ">
              <div className="sm:mt-0 mt-10">
                <p className="font-nerisSemiBold lg:text-lg text-base text-white mb-4">
                  {t("footer.getInTouch")}
                </p>
                <div className=" flex gap-3 flex-col">
                  <Link
                    to="/"
                    className="font-nerisLight lg:text-base text-sm text-white  hover:text-white/80 duration-300"
                  >
                    {t("footer.aboutUs")}
                  </Link>
                  <Link
                    to="/"
                    className="font-nerisLight  lg:text-base text-sm text-white  hover:text-white/80 duration-300"
                  >
                    {t("footer.howItWorks")}
                  </Link>
                </div>
              </div>
              {/* Contact */}
              <div className="space-y-3">
                <p className="font-nerisSemiBold lg:text-lg text-base text-white mb-4">
                  {t("footer.contact")}
                </p>
                <div className="cursor-pointer flex gap-2 items-center">
                  <CallSvg />
                  <p className="font-nerisLight lg:text-base text-sm text-white  hover:text-white/80 duration-300">
                    {t("footer.tollFree")}
                  </p>
                </div>
                <div className="cursor-pointer flex gap-2 items-center">
                  <CallSvg />
                  <p className="font-nerisLight lg:text-base text-sm text-white  hover:text-white/80 duration-300">
                    {t("footer.phone")}
                  </p>
                </div>
                <div className="cursor-pointer flex gap-2 items-center ">
                  <MailSvg />
                  <p className="font-nerisLight lg:text-base text-sm text-white hover:text-white/80 duration-300">
                    {t("footer.email")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="lg:text-sm font-Poppins text-white text-center mt-18 text-xs">
            {t("footer.copyright")}
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
