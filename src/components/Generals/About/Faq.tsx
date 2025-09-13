import { useState } from "react";
import Title from "../../common/Title"; 
import { useQuery } from "@tanstack/react-query";
import { GetData } from "../../../api/API";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";
import { FaqData } from "../Home/Faq";

type faqs = {
  categoryTitle: string;
  faqs: [];
  question: string;
  answer: string;
};

const Faq = () => {
  const { t } = useTranslation("about");
  const {
    data: list,
    isLoading: listLoading,
    error: listError,
  } = useQuery({
    queryKey: ["faq-list"],
    queryFn: () => GetData("cms/faq"),
  });
  const [category, setCategory] = useState(list?.[0]?.categoryTitle);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const selectedFaqCategory = list?.find(
    (faq) => faq?.categoryTitle === category
  );
  const totalItems = selectedFaqCategory?.faqs?.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedFaqs = selectedFaqCategory?.faqs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (categoryTitle: string) => {
    setCategory(categoryTitle);
    setCurrentPage(1);
  };

  // const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  // const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const { data, isLoading, error } = useQuery({
    queryKey: ["faq"],
    queryFn: () => GetData("/cms/faq-section"),
  });

  const faqData = t("faq.categories", { returnObjects: true }) as any[];

  return isLoading ? (
    <p className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p className="flex items-center justify-center h-screen">
      Something went wrong.
    </p>
  ) : (
    <div>
      <div className="flex flex-col items-center gap-3">
        <Title className="font-nerisSemiBold">{data?.title || t("faq.title")}</Title>
        <p className="font-Poppins font-light">{data?.subTitle || t("faq.subtitle")}</p>
      </div>
      <div className="px-5 sm:px-10 2xl:px-60">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-center gap-5 py-10 ">
          {list?.map((data) => {
            return (
              <div
                key={data?.categoryTitle}
                onClick={() => handleCategoryChange(data?.categoryTitle)}
                className={cn(
                  "bg-white rounded-xl p-6 border border-gray-200 cursor-pointer font-nerisSemiBold text-primaryColor flex flex-col gap-3 items-center",
                  data?.categoryTitle === category &&
                    "border-primaryColor shadow-sm shadow-black/20"
                )}
              >
                <span>{data?.icon}</span>
                {data?.categoryTitle}
              </div>
            );
          })}
        </div> */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 px-0">
          <FaqData faqs={list || faqData} />
        </div>
        {/* Pagination Controls */}
        {/* {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-2 rounded-xl border transition-all duration-300 group hover:border-primaryColor",
                currentPage === 1
                  ? "text-primaryColor cursor-not-allowed opacity-50"
                  : "hover:bg-primaryColor"
              )}
            >
              <ArrowLeftOutlined
                className={cn(
                  "!transition-colors duration-300",
                  currentPage === 1
                    ? "!text-primaryColor"
                    : "group-hover:!text-white text-primaryColor"
                )}
              />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-2 rounded-xl border border-primaryColor transition-all duration-300 group",
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed text-primaryColor"
                  : "hover:bg-primaryColor"
              )}
            >
              <ArrowRightOutlined
                className={cn(
                  "!transition-colors duration-300",
                  currentPage === totalPages
                    ? "!text-primaryColor"
                    : "group-hover:!text-white text-primaryColor"
                )}
              />
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Faq;
