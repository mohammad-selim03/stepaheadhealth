import { createBrowserRouter } from "react-router";
import PatientLayout from "../layout/PatientLayout";
import MainLayout from "../layout/MainLayout";
import LogIn from "../pages/auth/LogIn";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Verification from "../pages/auth/Verification";
import NewPassword from "../pages/auth/NewPassword";
import Home from "../pages/General/Home";
import ErrorPage from "../pages/Dashboards/General/ErrorPage";
import About from "../pages/General/About";
import Contacts from "../pages/Contact/Contacts";
import SetupPage from "../pages/Dashboards/Patients/SetupPage";
import ImageUpload from "../pages/Dashboards/Patients/ImageUpload";
import Dashboards from "../pages/Dashboards/Patients/Dashboards";
import Requests from "../pages/Dashboards/Patients/Requests";
import Payments from "../pages/Dashboards/Patients/Payments";
import Pharmacys from "../pages/Dashboards/Patients/Pharmacys";
import Settings from "../pages/Dashboards/Patients/Settings";
import RxSteps from "../pages/Dashboards/Patients/RxSteps";
import Diseases from "../pages/General/Diseases";
import BillingAndPayment from "../pages/Dashboards/Patients/BillingAndPayment";
import Details from "../pages/Dashboards/Patients/Details";
import Messages from "../pages/Dashboards/Patients/Messages";
import ProviderLayout from "../layout/ProviderLayout";
import ProviderDashboard from "../pages/Dashboards/Provider/ProviderDashboard";
import ProviderDetails from "../pages/Dashboards/Provider/ProviderDetails";
import ProviderMessages from "../pages/Dashboards/Provider/ProviderMessages";
import ProviderPrescriptions from "../pages/Dashboards/Provider/ProviderPrescriptions";
import ProviderFinancial from "../pages/Dashboards/Provider/ProviderFinancial";
import ProviderRefer from "../pages/Dashboards/Provider/ProviderRefer";
import ProfileSettings from "../pages/Dashboards/Provider/ProviderSetting/ProfileSettings";
import ChangePasswords from "../pages/Dashboards/Provider/ProviderSetting/ChangePasswords";
import PaymentSettings from "../pages/Dashboards/Provider/ProviderSetting/PaymentSettings";
import ProviderSetting from "../pages/Dashboards/Provider/ProviderSetting/ProviderSetting";
import SettingsLayout from "../layout/SettingsLayout";
import ProviderStepPage from "../pages/Dashboards/Provider/ProviderStepPage";
import ProviderImageUpload from "../pages/Dashboards/Provider/ProviderImageUpload";
import ProtectedRoute from "./ProtectedRoute";
import EmailVerify from "../pages/auth/EmailVerify";
import PatientDetails from "../pages/Dashboards/Provider/PatientDetails";
import Success from "../components/shared/Success";
import IdpTerms from "../pages/Dashboards/Provider/IDP/IdpTerms";
import IdpInfo from "../pages/Dashboards/Provider/IDP/IdpInfo";
import MailConfirm from "../pages/Dashboards/Provider/IDP/MailConfirm";
import ImageUploadPatient from "../pages/Dashboards/Patients/ImageUploadPatient";
import ChooseRoll from "../pages/auth/ChooseRoll";
import Cancel from "../components/shared/Cancel";
import Return from "../pages/Dashboards/Provider/Return";
import MyClinician from "../pages/Dashboards/Patients/MyClinician";
import PrescriptionLog from "../pages/Dashboards/Provider/PrescriptionLog";
import TermsServices from "../pages/General/TermsServices";

export const routes = createBrowserRouter([
  // provider routes
  {
    element: (
      <ProtectedRoute allowedRoles={["Patient"]}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/patient-dashboard", element: <Dashboards /> },
      { path: "/patient-details/:id", element: <PatientDetails /> },
      { path: "/request", element: <Requests /> },
      { path: "/payment", element: <Payments /> },
      { path: "/pharmacy", element: <Pharmacys /> },
      { path: "/my-clinician", element: <MyClinician /> },
      { path: "/setting", element: <Settings /> },
      { path: "/request-rx-refill", element: <RxSteps /> },
      { path: "/billing-payment", element: <BillingAndPayment /> },
      { path: "/details", element: <Details /> },
      { path: "/messages", element: <Messages /> },
    ],
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["Clinician"]}>
        <ProviderLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/provider-dashboard", element: <ProviderDashboard /> },
      {
        path: "/provider-all-prescriptions",
        element: <ProviderPrescriptions />,
      },
      { path: "/provider-pinancial-dashboard", element: <ProviderFinancial /> },
      { path: "/provider-refer-patient", element: <ProviderRefer /> },
      { path: "/provider-details/:id", element: <ProviderDetails /> },
      { path: "/provider-messages", element: <ProviderMessages /> },
      { path: "/prescription-log", element: <PrescriptionLog /> },
    ],
  },
  {
    path: "/provider-setting",
    element: <SettingsLayout />,
    children: [
      { index: true, element: <ProfileSettings /> },
      { path: "profile", element: <ProfileSettings /> },
      { path: "provider", element: <ProviderSetting /> },
      { path: "payment", element: <PaymentSettings /> },
      { path: "change-password", element: <ChangePasswords /> },
    ],
  },

  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      // patient profile stepper
      {
        path: "/patient",
        element: (
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <SetupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/image-upload",
        element: (
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <ImageUploadPatient />
          </ProtectedRoute>
        ),
      },
      {
        path: "/image-upload2",
        element: (
          <ProtectedRoute allowedRoles={["PROVIDER"]}>
            <ImageUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: "/provider-steps",
        element: (
          <ProtectedRoute allowedRoles={["PROVIDER"]}>
            <ProviderStepPage />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/provider-steps-image",
        element: (
          <ProtectedRoute allowedRoles={["PROVIDER"]}>
            <ProviderImageUpload />{" "}
          </ProtectedRoute>
        ),
      },

      {
        path: "/About",
        element: <About />,
      },
      {
        path: "/stripe/onboard/return",
        element: <Return />,
      },
      {
        path: "/stripe/payment/success",
        element: <Success />,
      },
      {
        path: "/stripe/payment/cancel",
        element: <Cancel />,
      },
      {
        path: "/diseases",
        element: <Diseases />,
      },
      {
        path: "/idp/verification",
        element: <IdpTerms />,
      },
      {
        path: "/terms-services",
        element: <TermsServices />,
      },
      {
        path: "/idp/info",
        element: <IdpInfo />,
      },
      {
        path: "/idp/mail-confirmation",
        element: <MailConfirm />,
      },
      {
        path: "/contact-us",
        element: <Contacts />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/choose-role",
        element: <ChooseRoll />,
      },
      {
        path: "/email-verify",
        element: <EmailVerify />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verification",
        element: <Verification />,
      },
      {
        path: "/new-password",
        element: <NewPassword />,
      },
    ],
  },
]);
