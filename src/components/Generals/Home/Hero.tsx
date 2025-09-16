import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { imageProvider } from "../../../lib/imageProvider";
import { Button } from "antd";
import { AppleIcon, PlaystoreIcon } from "./HomeIcons"; 

const Hero = () => {
  const { t } = useTranslation();
  const role = JSON.parse(localStorage.getItem("role") || "null");
  // const query = role == "Patient" ? "patient/profile" : "clinician/profile";
 
  const isProfileCreated = JSON.parse(
    localStorage.getItem("is_profile_created") || "null"
  );

  const token = JSON.parse(localStorage.getItem("token") || "null");

  if (!token) {
    localStorage.removeItem("role");
  }

  return (
    <div className="py-10">
      <div className="flex flex-col lg:flex-row items-center gap-5">
        <p className="max-w-[777px] text-3xl md:text-4xl lg:text-5xl font-black font-nerisBlack">
          {t("home.hero.title")}
        </p>
        <div className="flex flex-col gap-2">
          <p>{t("home.hero.description")}</p>
          <p className="font-nerisLight font-semibold py-5">
            {t("home.hero.discount")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {role === "Patient" && (
              <Link to={isProfileCreated ? "patient-dashboard" : "/patient"}>
                <Button className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300">
                  {t("home.hero.patientButton")}
                </Button>
              </Link>
            )}
            {role === "Clinician" && (
              <Link
                to={isProfileCreated ? "provider-dashboard" : "/provider-steps"}
              >
                <Button className="!bg-transparent !h-12 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105">
                  {t("home.hero.providerButton")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* images */}
      <DocImages />
    </div>
  );
};

const DocImages = () => {
  const { t } = useTranslation();
  return (
    <div className="py-10 font-nerisLight">
      <div className="flex flex-col md:flex-row items-start gap-3 lg:gap-6">
        <div className="flex flex-col items-start gap-3 lg:gap-6">
          <div className="flex flex-col 2xl:flex-row items-center gap-3 lg:gap-6">
            <img
              src={imageProvider.docs1}
              alt="first doct image"
              className="max-w-[300px] h-[320px] lg:max-w-[472px] lg:h-[458px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
            />
            <img
              src={imageProvider.docs2}
              alt="second doct image"
              className="max-w-[400px] lg:max-w-[472px] h-[320px] lg:h-[458px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
            />
          </div>
          <div className="bg-primaryColor p-8 rounded-lg w-full shadow-lg shadow-black/30">
            <p className="text-white font-nerisLight">
              {t("home.hero.downloadApp")}
            </p>
            <div className="flex flex-wrap items-center gap-5 py-5">
              <Button className="!flex !items-center !gap-3 !h-14 !rounded-xl !font-semibold hover:!scale-105 !transition-all !duration-300">
                {t("home.hero.googlePlay")} <PlaystoreIcon />
              </Button>
              <Button className="!flex !items-center !gap-3 !h-14 !rounded-xl !bg-black !text-white !border-black !font-semibold hover:!scale-105 !transition-all !duration-300">
                {t("home.hero.appStore")} <AppleIcon />{" "}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <img
            src={imageProvider.docs3}
            alt="third doct image"
            className="w-[472px] h-[350px] md:h-[662px] rounded-xl object-cover hover:-translate-y-2 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

// import { useQuery } from "@tanstack/react-query";
// import { GetData } from "../../../api/API";
// import { Button } from "antd";
// import { imageProvider } from "../../../lib/imageProvider";
// import { AppleIcon, PlaystoreIcon } from "./HomeIcons";

// const Hero = () => {
//   const role = JSON.parse(localStorage.getItem("role") || "null");
//   const query = role == "Patient" ? "patient/profile" : "clinician/profile";
//   const { data } = useQuery({
//     queryKey: ["profile"],
//     queryFn: () => GetData(query),
//   });
//   const isProfileCreated = JSON.parse(
//     localStorage.getItem("is_profile_created") || "null"
//   );
//   return (
//     <div className="py-10">
//       <div className="flex flex-col lg:flex-row items-center gap-5">
//         <p className="max-w-[777px] text-3xl md:text-4xl lg:text-5xl font-black font-nerisBlack">
//           #1 Telemedicine App: Online Doctor Consultation 24/7
//         </p>
//         <div className="flex flex-col gap-2">
//           <p>
//             Skip the travel! Get expert medical advice from the comfort of your
//             home. Our Telehealth app connects you with experienced doctors and
//             healthcare providers.
//           </p>
//           <p className="font-nerisLight font-semibold py-5">
//             First prescription and refill starting at a discount rate!
//           </p>
//           <div className="flex flex-wrap items-center gap-4">
//             {role === "Patient" && (
//               <Link to={isProfileCreated ? "patient-dashboard" : "/patient"}>
//                 <Button className="!bg-primaryColor !h-12 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300">
//                   Patient? Click Here
//                 </Button>
//               </Link>
//             )}
//             {role === "Clinician" && (
//               <Link
//                 to={isProfileCreated ? "provider-dashboard" : "/provider-steps"}
//               >
//                 <Button className="!bg-transparent !h-12 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105">
//                   Provider? Click Here
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* images */}
//       <DocImages />
//     </div>
//   );
// };

// const DocImages = () => {
//   return (
//     <div className="py-10 font-nerisLight">
//       <div className="flex flex-col md:flex-row items-start gap-3 lg:gap-6">
//         <div className="flex flex-col items-start gap-3 lg:gap-6">
//           <div className="flex flex-col 2xl:flex-row items-center gap-3 lg:gap-6">
//             <img
//               src={imageProvider.docs1}
//               alt="first doct image"
//               className="max-w-[300px] h-[320px] lg:max-w-[472px] lg:h-[458px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
//             />
//             <img
//               src={imageProvider.docs2}
//               alt="second doct image"
//               className="max-w-[400px] lg:max-w-[472px] h-[320px] lg:h-[458px] rounded-xl object-cover object-top hover:-translate-y-2 transition-all duration-300"
//             />
//           </div>
//           <div className="bg-primaryColor p-8 rounded-lg w-full shadow-lg shadow-black/30">
//             <p className="text-white font-nerisLight">
//               Get StepAhead Health on your smartphone. Download the application
//               now!
//             </p>
//             <div className="flex flex-wrap items-center gap-5 py-5">
//               <Button className="!flex !items-center !gap-3 !h-14 !rounded-xl !font-semibold hover:!scale-105 !transition-all !duration-300">
//                 Get it on Google Play <PlaystoreIcon />
//               </Button>
//               <Button className="!flex !items-center !gap-3 !h-14 !rounded-xl !bg-black !text-white !border-black !font-semibold hover:!scale-105 !transition-all !duration-300">
//                 Download it on App Store <AppleIcon />{" "}
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div>
//           <img
//             src={imageProvider.docs3}
//             alt="third doct image"
//             className="w-[472px] h-[350px] md:h-[662px] rounded-xl object-cover hover:-translate-y-2 transition-all duration-300"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
