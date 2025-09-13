import { useQuery } from "@tanstack/react-query";
import Faq from "../../components/Generals/Home/Faq";
import Hero from "../../components/Generals/Home/Hero";
import Provider from "../../components/Generals/Home/Provider";
import Service from "../../components/Generals/Home/Service";
import Smart from "../../components/Generals/Home/Smart";
import Start from "../../components/Generals/Home/Start";
import TopDiseases from "../../components/Generals/Home/TopDiseases";
import TopMedicalConditions from "../../components/Generals/Home/TopMedicalConditions";
import TopMedications from "../../components/Generals/Home/TopMedications";
import Works from "../../components/Generals/Home/Works";
import Container from "../../components/shared/Container";
import { useTranslation } from "react-i18next";
import { GetData } from "../../api/API";

const Home = () => {
  const { t } = useTranslation();

  const role = JSON.parse(localStorage.getItem("role") || "null");

  const query = role === "Clinician" ? "clinician/profile" : "patient/profile";
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData(query),
  });

  const lang = localStorage.getItem("lang");

  return (
    <Container>
      {/* Example usage of translation: */}
      {/* <h1>{t("Home")}</h1> */}
      <Hero />
      <Works />
      <Service data={data} />
      <Provider />
      <Smart />
      <Start />
      <TopDiseases lang={lang} />
      <TopMedicalConditions lang={lang} />
      <TopMedications lang={lang} />
      <Faq />
    </Container>
  );
};

export default Home;
