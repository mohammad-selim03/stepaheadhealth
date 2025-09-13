import { Button, Steps, theme } from "antd";
import { useEffect, useRef, useState } from "react";

import Setp2 from "./Setp2";
import Setp3 from "./Setp3";
import Setp4 from "./Setp4";
import Setp1 from "./Setp1";
import Setp5 from "./Setp5";
import { useLocation } from "react-router";

const Setup: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);
  const step1DataRef = useRef(null);

  const handleStep1Next = (data: any) => {
    step1DataRef.current = data;
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: (
        <p
          className={`lg:text-xl md:text-base sm:text-[10px] text-[8px] font-nerisSemiBold lg:mt-5 md:pl-5  pl-2  transition duration-300${
            current === 0 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          Choose <br /> Pharmacy
        </p>
      ),
      content: <Setp1 ref={step1Ref} onNext={handleStep1Next} />,
    },
    {
      title: (
        <p
          className={`lg:text-xl md:text-base sm:text-[10px] text-[8px] font-nerisSemiBold lg:mt-5 md:pl-5 pl-2 transition duration-300 ${
            current === 1 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          Choose <br /> Medicines
        </p>
      ),
      content: <Setp2 ref={step2Ref} onNext={() => setCurrent(current + 1)} />,
    },
    {
      title: (
        <p
          className={`lg:text-xl md:text-base sm:text-[10px] text-[8px] font-nerisSemiBold lg:mt-5 md:pl-5 pl-2 transition duration-300 ${
            current === 2 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          Refill <br /> Information
        </p>
      ),
      content: <Setp3 ref={step3Ref} onNext={() => setCurrent(current + 1)} />,
    },
    {
      title: (
        <p
          className={`lg:text-xl md:text-base sm:text-[10px] text-[8px] font-nerisSemiBold lg:mt-5 md:pl-5  pl-2 transition duration-300 ${
            current === 3 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          Patient <br /> Information
        </p>
      ),
      content: <Setp4 ref={step4Ref} onNext={() => setCurrent(current + 1)} />,
    },
    {
      title: (
        <p
          className={`lg:text-xl md:text-base sm:text-[10px] text-[8px] font-nerisSemiBold lg:mt-5 md:pl-5 pl-2 transition duration-300 ${
            current === 4 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          Review & <br /> Confirm
        </p>
      ),
      content: <Setp5 ref={step5Ref} onNext={() => setCurrent(current + 1)} />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };

  const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];

  const location = useLocation();
  useEffect(() => {
    if (location.state?.startFromStep === 1) {
      setCurrent(1);
    }
  }, [location.state]);

  return (
    <div className="max-w-[1480px] mx-auto mt-5">
      <div className="pt-8 w-full">
        <Steps
          current={current}
          items={items}
          className="custom-steps !px-0 !mx-0 !w-full"
          responsive={false}
          progressDot={(_iconDot, { index, status }) => {
            let bgColor = "#FFFFFF";
            if (status === "process") bgColor = "#195B91";
            else if (status === "finish") bgColor = "#195B91";
            else if (index > current) bgColor = "#55C9EA";

            return (
              <div
                style={{ backgroundColor: bgColor }}
                className="text-white rounded-full lg:w-12 lg:h-12 w-8 h-8 flex justify-center items-center lg:text-2xl text-base  lg:-mt-5 -ml-2 z-[1] -mt-3"
              >
                {index + 1}
              </div>
            );
          }}
        />
        <div style={contentStyle} className="!bg-[#F2F8FF] !mt-10 !p-6">
          {steps[current].content}
        </div>

        <div className="mt-6 mb-10 w-fit mx-auto">
          {current > 0 && current < steps.length - 1 && (
            <>
              <div className=" flex flex-col gap-5 md:flex-row justify-center">
                <Button
                  onClick={() => setCurrent(current - 1)}
                  className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={() => refs[current]?.current?.submit()}
                  className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {current === steps.length - 1 && (
            <>
              <div className=" flex flex-col gap-5 md:flex-row justify-center">
                <Button
                  onClick={() => setCurrent(current - 1)}
                  className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={async () => {
                    const isValid = await step5Ref.current?.submit();
                  }}
                  className=" !bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
