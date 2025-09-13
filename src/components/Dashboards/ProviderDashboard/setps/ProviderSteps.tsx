import { Button, message, Steps, theme } from "antd";
import { useRef, useState, useTransition } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../../api/API";
import { useTranslation } from "react-i18next";

const ProviderSteps: React.FC = () => {
  const [data, setData] = useState({});
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step1DataRef = useRef(null);

  const handleStep1Next = (data?: any | null | undefined) => {
    step1DataRef.current = data;
    setCurrent(current + 1);
  };

  // get trans object
  const { t } = useTranslation("providerdashboard");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const { data: doesData } = useQuery({
    queryKey: ["doespotData"],
    queryFn: () =>
      GetData(`clinician/npi-registry-data?npi=${userInfo?.npiId}`),
  });

  const modifiedData = doesData?.results?.[0];
  console.log("data", modifiedData);
  const steps = [
    {
      title: (
        <p
          className={`lg:text-2xl md:text-base text-xs font-nerisSemiBold lg:mt-5 pl-5 transition duration-300  ${
            current === 0 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          {t("step1")}
        </p>
      ),
      content: (
        <Step1
          ref={step1Ref}
          onNext={handleStep1Next}
          doesData={modifiedData}
        />
      ),
    },
    {
      title: (
        <p
          className={`lg:text-2xl md:text-base text-xs font-nerisSemiBold lg:mt-5 pl-5 transition duration-300 ${
            current === 1 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          {t("step2")}
        </p>
      ),
      content: (
        <Step2
          ref={step2Ref}
          onNext={() => setCurrent(current + 1)}
          doesData={modifiedData}
        />
      ),
    },
    {
      title: (
        <p
          className={`lg:text-2xl md:text-base text-xs font-nerisSemiBold lg:mt-5 pl-5 transition duration-300 ${
            current === 2 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          {t("step3")}
        </p>
      ),
      content: (
        <Step3
          ref={step3Ref}
          onNext={() => setCurrent(current + 1)}
          doesData={modifiedData}
        />
      ),
    },
    {
      title: (
        <p
          className={`lg:text-2xl md:text-base text-xs font-nerisSemiBold lg:mt-5 pl-5 transition duration-300 ${
            current === 3 ? "text-textPrimary" : "text-textSecondary"
          }`}
        >
          {t("step4")}
        </p>
      ),
      content: (
        <Step4
          ref={step4Ref}
          onNext={() => setCurrent(current + 1)}
          setData={setData}
          doesData={modifiedData}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };

  const refs = [step1Ref, step2Ref, step3Ref, step4Ref];
  const navigator = useNavigate();

  return (
    <div className="max-w-[1480px] mx-auto">
      <div className="pt-10 w-full ">
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
              <div>
                <div
                  style={{ backgroundColor: bgColor }}
                  className="text-white rounded-full lg:w-12 lg:h-12 w-8 h-8 flex justify-center items-center lg:text-2xl text-base  lg:-mt-5 -ml-2 z-[1] -mt-3"
                >
                  {index + 1}
                </div>
              </div>
            );
          }}
        />

        <div style={contentStyle} className="!bg-[#F2F8FF] !mt-10 !p-6">
          {steps[current]?.content}
        </div>

        <div className="mt-6 mb-10 w-fit mx-auto">
          {current === 0 && (
            <Button
              type="primary"
              onClick={() => step1Ref.current?.submit()}
              className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
            >
              {t("continue")}
            </Button>
          )}
          {current > 0 && current < steps.length - 1 && (
            <>
              <div className="md:flex-row gap-5 items-center flex flex-col ">
                <Button
                  onClick={() => setCurrent(current - 1)}
                  className="!bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
                >
                  {t("previous")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => refs[current]?.current?.submit()}
                  className="!bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
                >
                  {t("next")}
                </Button>
              </div>
            </>
          )}

          {current === steps.length - 1 && (
            <>
              <div className="md:flex-row gap-5 items-center flex flex-col ">
                <Button
                  onClick={() => setCurrent(current - 1)}
                  className=" !bg-white !text-[#195B91] !font-nerisSemiBold !py-5 !w-[246px] !outline !outline-[#195B91] hover:!bg-[#195B91] hover:!text-white hover:!border-none"
                >
                  {t("previous")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    step4Ref.current?.submit?.((isValid: boolean) => {
                      if (isValid) {
                        message.success("Processing complete!");
                      }
                    });
                    // navigator("/image-upload");
                  }}
                  className=" !bg-[#195B91] !text-white !font-nerisSemiBold !py-5 !w-[246px] hover:!bg-white hover:!outline hover:!outline-[#195B91] hover:!text-[#195B91]"
                >
                  {t("done")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderSteps;
