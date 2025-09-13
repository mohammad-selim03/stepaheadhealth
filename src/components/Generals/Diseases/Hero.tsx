import { imageProvider } from "../../../lib/imageProvider";
import Title from "../../common/Title";

const Hero = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row  items-start md:items-center justify-between py-14">
        <Title className="font-nerisBlack">Fibromyalgia</Title>
        <p className="font-Poppins font-light text-textSecondary w-full md:w-1/2 pt-3 md:pt-0">
          Fibromyalgia is a complex and chronic medical condition characterized
          by widespread musculoskeletal pain, tenderness, and fatigue.
          Individuals with fibromyalgia may also experience other symptoms such
          as sleep disturbances, cognitive difficulties (often referred to as
          "fibro fog"), and heightened sensitivity to stimuli. The exact cause
          of fibromyalgia is not well understood, and it can be challenging to
          diagnose due to the absence of specific laboratory tests or visible
          signs.
        </p>
      </div>
      <div className="pb-10">
        <div className="flex flex-col xl:flex-row items-center gap-5">
          <div className="flex flex-col gap-5">
            <img
              src={imageProvider.fab1}
              alt=""
              className="w-[407px] h-[276px] rounded-md"
            />
            <img
              src={imageProvider.fab4}
              alt=""
              className="w-[407px] h-[276px] rounded-md"
            />
          </div>
          <img
            src={imageProvider.fab2}
            alt=""
            className="w-[602px] h-[276px] md:h-[573px] rounded-md"
          />
          <div className="flex flex-col gap-5">
            <img
              src={imageProvider.fab3}
              alt=""
              className="w-[407px] h-[276px] rounded-md"
            />
            <img
              src={imageProvider.fab5}
              alt=""
              className="w-[407px] h-[276px] rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
