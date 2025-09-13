// import Faq from "../../components/Generals/About/Faq";
import Hero from "../../components/Generals/About/Hero";
import TelehealthServices from "../../components/Generals/About/TelehealthServices";
import RefillRequest from "../../components/Generals/Home/RefillRequest";
import Works from "../../components/Generals/Home/Works";
import Container from "../../components/shared/Container";

const About = () => {
  return (
    <Container>
      <div className="flex flex-col gap-5">
        <Hero />
        <Works />
        <TelehealthServices />
        <RefillRequest />
        {/* <Faq /> */}
      </div>
    </Container>
  );
};

export default About;
