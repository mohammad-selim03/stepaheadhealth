import Title from "../../common/Title";
import { Collapse } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";

const Faq = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["faq"],
    queryFn: () => GetData("/cms/faq-section"),
  });
  const {
    data: list,
    isLoading: listLoading,
    error: listError,
  } = useQuery({
    queryKey: ["faq-list"],
    queryFn: () => GetData("cms/faq"),
  });

  const faqs = t("home.faq.faqs", { returnObjects: true }) as {
    key: number;
    label: string;
    children: string;
  }[];

  const lang = localStorage.getItem("lang");

  return isLoading ? (
    <p className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p className="flex items-center justify-center h-screen">
      Something went wrong.
    </p>
  ) : listLoading ? (
    <Loader color="#000000" />
  ) : (
    <div className="flex flex-col xl:flex-row items-start gap-5 py-10">
      <div className="w-fit text-wrap lg:text-nowrap">
        <Title className="font-nerisSemiBold">
          {lang === "es" ? data?.titleEs : data?.title || t("home.faq.title")}
        </Title>
        <p className="py-3">
          {lang === "es"
            ? data?.subTitleEs
            : data?.subTitle || t("home.faq.subtitle")}
        </p>
      </div>
      <div className="w-full">
        <FaqData faqs={list || faqs} />
      </div>
    </div>
  );
};

export default Faq;

export const FaqData = ({ faqs }) => {
  const lang = localStorage.getItem("lang");
  const collapseItems = faqs?.map((faq, idx: number) => ({
    key: `${idx}`,
    label: lang === "es" ? faq?.questionEs : faq?.question || faq?.label,
    children: (
      <div>{lang === "es" ? faq?.answerEs : faq?.answer || faq?.children}</div>
    ),
  }));

  return (
    <div>
      <Collapse
        accordion
        items={collapseItems}
        bordered={false}
        className="!border-0 faq-collapse"
        rootClassName="!border-0"
        expandIconPosition="end"
        style={{
          background: "transparent",
        }}
      />
      <style>{`
        .faq-collapse .ant-collapse-item {
          border: 0px solid #e5e7eb !important;
          border-radius: 0px !important;
          margin-bottom: 8px !important;
          background: #F2F8FF !important;
          padding: 10px 0 !important;
        }
        
        .faq-collapse .ant-collapse-item:last-child {
          margin-bottom: 0 !important;
        }
        
        .faq-collapse .ant-collapse-header {
          padding: 16px 20px !important;
          font-weight: 500 !important;
          font-size: 16px !important;
          color: #1f2937 !important;
          border-radius: 8px !important;
        }
        
        .faq-collapse .ant-collapse-content {
          border-top: 1px solid #e5e7eb !important;
        background: #F2F8FF !important;
        }
        
        .faq-collapse .ant-collapse-content-box {
          padding: 16px 20px !important;
          color: #6b7280 !important;
          line-height: 1.6 !important;
        }
        
        .faq-collapse .ant-collapse-expand-icon {
          color: #6b7280 !important;
          font-size: 14px !important;
        }
        
        .faq-collapse .ant-collapse-item-active .ant-collapse-header {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
};
