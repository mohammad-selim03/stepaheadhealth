import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import esTranslation from "./locales/es/translation.json";
import enAboutTranslation from "./locales/en/about.json";
import esAboutTranslation from "./locales/es/about.json";
import enContactTranslation from "./locales/en/contact.json";
import esContactTranslation from "./locales/es/contact.json";
import enLoginTranslation from "./locales/en/login.json";
import esLoginTranslation from "./locales/es/login.json";
import enSignupTranslation from "./locales/en/signup.json";
import esSignupTranslation from "./locales/es/signup.json";
import enChooseRollTranslation from "./locales/en/chooseroll.json";
import esChooseRollTranslation from "./locales/es/chooseroll.json";
import enPatientDashboardTranslation from "./locales/en/patientdashboard.json";
import esPatientDashboardTranslation from "./locales/es/patientdashboard.json";
import enProviderDashboardTranslation from "./locales/en/providerdashboard.json";
import esProviderDashboardTranslation from "./locales/es/providerdashboard.json";
import enProviderStepsTranslation from "./locales/en/providersteps.json";
import esProviderStepsTranslation from "./locales/es/providersteps.json";
import enPatientProfileCreationTranslation from "./locales/en/patientprofilecreation.json";
import esPatientProfileCreationTranslation from "./locales/es/patientprofilecreation.json";

const savedLang = localStorage.getItem("lang") || "en";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
      about: enAboutTranslation,
      contact: enContactTranslation,
      login: enLoginTranslation,
      signup: enSignupTranslation,
      chooseroll: enChooseRollTranslation,
      patientdashboard: enPatientDashboardTranslation,
      providerdashboard: enProviderDashboardTranslation,
      providersteps: enProviderStepsTranslation,
      patientprofilecreation: enPatientProfileCreationTranslation,
    },
    es: {
      translation: esTranslation,
      about: esAboutTranslation,
      contact: esContactTranslation,
      login: esLoginTranslation,
      signup: esSignupTranslation,
      chooseroll: esChooseRollTranslation,
      patientdashboard: esPatientDashboardTranslation,
      providerdashboard: esProviderDashboardTranslation,
      providersteps: esProviderStepsTranslation,
      patientprofilecreation: esPatientProfileCreationTranslation,
    },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
