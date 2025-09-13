import Causes from "../../components/Generals/Diseases/Causes";
import Hero from "../../components/Generals/Diseases/Hero";
import OtherDiseases from "../../components/Generals/Diseases/OtherDiseases";
import Symptoms from "../../components/Generals/Diseases/Symptoms";
import Container from "../../components/shared/Container";
import Management from "./Management";

const Diseases = () => {
  return (
    <Container>
      <Hero />
      <Causes />
      <Symptoms />
      <Management />
      <OtherDiseases />
    </Container>
  );
};

export default Diseases;
