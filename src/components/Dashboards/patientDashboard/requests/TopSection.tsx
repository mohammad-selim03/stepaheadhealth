import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  List,
  Modal,
  Upload,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query"; 
import Loader from "../../../common/Loader";
import { UploadSvg } from "../../../../assets/svgContainer";
import { DeleteOutlined } from "@ant-design/icons";
import { GetData, PostData } from "../../../../api/API";
 

type Inputs = {
  name?: string;
  firstName?: string;
  lastName?: string;
  primaryPhone?: string;
  height?: string;
  weight?: string;
  healthConditionsAndSymptoms?: string;
  pastMedicalConditionsHistory?: string;
  allergies?: string;
  pharmacy?: string;
  phone?: string;
  address?: string;
};
type pharmacyDatatype = {
  storeName?: string;
  address1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  primaryPhone?: string;
};


const TopSection = () => {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading, error } = useQuery<Inputs>({
    queryKey: ["prescription-data,"],
    queryFn: () => GetData("patient/profile"),
  });
  const {
    data: pharmacyData,
    isLoading: pharmacyDataLoading,
    error: pharmacyDataError,
  } = useQuery<pharmacyDatatype>({
    queryKey: ["patient-profile"],
    queryFn: () => GetData("pharmacy"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  // Set form values when data loads
  useEffect(() => {
    if (data) {
      reset({
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        phone: data.primaryPhone || "",
        height: data.height || "",
        weight: data.weight || "",
      });
    }
  }, [data, reset]);

  // Get the token from localStorage
  const token = JSON.parse(localStorage.getItem("token") || "null");
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    // Check for duplicates
    const isDuplicate = fileList.some(
      (existingFile) =>
        existingFile.name === file.name && existingFile.size === file.size
    );

    if (isDuplicate) {
      toast.error(`${file.name} is already added`);
      return Upload.LIST_IGNORE;
    }

    // Check max limit
    if (fileList.length >= 10) {
      toast.error("You can only upload up to 10 files");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleRemove = (file) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
  };

  const Payment = useMutation({
    mutationKey: ["patient-payment"],
    mutationFn: (payload) =>
      PostData("payment/patient/payment-session", payload),
    onSuccess: (data) => {
      console.log("data", data);
      window.location.replace(data?.data?.url);
    },

    onError: () => {
      toast.error("Payment Failed. Try again.");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();

      // Append all files
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formPayload.append("documents", file?.originFileObj);
        }
      });

      // Append form data
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      // Append additional data
      formPayload.append("prescriptionType", "New");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/prescription/with-documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formPayload,
        }
      );

      const result = await response.json();
      console.log("res", result);
      const res = result?.data?.prescription;
      const data = {
        prescriptionId: res?.id,
        patientId: res?.patientUserId,
        prescriptionType: res?.prescriptionType,
      };

      if (response.ok) {
        toast.success("Prescription submitted successfully");
        setFileList([]);
        Payment.mutate(data);
        setOpen(false);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to submit prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className=" flex flex-col gap-2 items-center sm:flex-row justify-between">
        <Toaster />
        <div>
          <p className="font-nerisSemiBold lg:text-[32px] md:text-2xl sm:text-xl xm:text-base text-textPrimary">
            RX Refills Requests
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Flex vertical gap="middle" align="flex-start">
            {/* Basic */}
            <Button
              onClick={() => setOpen(true)}
              className="!bg-primaryColor md:!h-12 !h-8 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300"
            >
              Create New Rx Request
            </Button>
            <Modal
              centered
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              width="80%"
              className="custom-modal-bg"
              footer={null}
              closable={false}
            >
              {isLoading ? (
                <Loader />
              ) : error ? (
                <p className="text-center py-10">Something went wrong</p>
              ) : (
                <div className="p-5">
                  <div className=" flex items-center justify-between">
                    <p className="text-textPrimary font-nerisSemiBold lg:text-[32px] md:text-2xl sm:text-xl">
                      New Prescription Request
                    </p>

                    <Button
                      onClick={() => setOpen(false)}
                      className="!bg-transparent lg:!h-10 md:!h-8 !h-6 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl mt-10">
                    <p className="text-textPrimary font-nerisSemiBold md:text-2xl sm:text-xl text-base">
                      New Prescription Request
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 ">
                          {/* Name */}
                          <div className="flex gap-2 items-start flex-col mt-6">
                            <label className="text-textPrimary font-nerisSemiBold">
                              Name<span className="text-[#FF3B30]"> * </span>
                            </label>
                            <input
                              {...register("name", { required: true })}
                              placeholder="Enter Name Here"
                              type="text"
                              readOnly
                              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                            />
                            {errors.name && (
                              <span className="text-red-500">
                                Name is required
                              </span>
                            )}
                          </div>

                          {/* Mobile Number */}
                          <div className="flex gap-2 items-start flex-col mt-6">
                            <label className="text-textPrimary font-nerisSemiBold">
                              Primary Mobile Number
                              <span className="text-[#FF3B30]"> * </span>
                            </label>
                            <input
                              {...register("phone", { required: true })}
                              placeholder="Enter Mobile Number Here"
                              type="number"
                              readOnly
                              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                            />
                            {errors.phone && (
                              <span className="text-red-500">
                                Mobile Number is required
                              </span>
                            )}
                          </div>

                          {/* Height */}
                          <div className="flex gap-2 items-start flex-col mt-6">
                            <label className="text-textPrimary font-nerisSemiBold">
                              Height (LB)
                              <span className="text-[#FF3B30]"> * </span>
                            </label>
                            <input
                              {...register("height", { required: true })}
                              placeholder="Enter  Height Here"
                              type="text"
                              readOnly
                              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                            />
                            {errors.height && (
                              <span className="text-red-500">
                                Height is required
                              </span>
                            )}
                          </div>

                          {/* Weight */}
                          <div className="flex gap-2 items-start flex-col mt-6">
                            <label className="text-textPrimary font-nerisSemiBold">
                              Weight (IN)
                              <span className="text-[#FF3B30]"> * </span>
                            </label>
                            <input
                              {...register("weight", { required: true })}
                              placeholder="Enter  Weight Here"
                              type="text"
                              readOnly
                              className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff]"
                            />
                            {errors.weight && (
                              <span className="text-red-500">
                                Weight is required
                              </span>
                            )}
                          </div>
                        </div>

                        {pharmacyDataLoading ? (
                          <Loader />
                        ) : pharmacyDataError ? (
                          <p className="text-center py-10">No data found.</p>
                        ) : (
                          <div className="pt-5">
                            <h3 className="text-xl font-semibold mb-4">
                              Pharmacy Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">Name:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.storeName || "N/A"}
                                />
                              </div>
                              <div>
                                <p className="font-medium">Address:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.address1 || "N/A"}
                                />
                              </div>
                              <div>
                                <p className="font-medium">city:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.city || "N/A"}
                                />
                              </div>
                              <div>
                                <p className="font-medium">State:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.state || "N/A"}
                                />
                              </div>
                              <div>
                                <p className="font-medium">Zip Code:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.zipCode || "N/A"}
                                />
                              </div>
                              <div>
                                <p className="font-medium">Phone:</p>
                                <input
                                  className="py-3 px-3 rounded-md border border-gray-200 outline-0 w-full"
                                  readOnly
                                  value={pharmacyData?.primaryPhone || "N/A"}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* image/documents upload */}

                        <div className="my-10">
                          <div className="max-w-[1480px] mx-auto px-2">
                            <Toaster />
                            <p className="text-textPrimary font-nerisSemiBold text-xl w-fit mx-auto mb-6">
                              Upload Images Or Pdf
                            </p>
                            {/* <ImgCrop rotationSlider> */}
                            <Upload
                              multiple={true}
                              accept="image/*,.pdf"
                              className="custom-upload"
                              listType="picture-card"
                              name="avatar"
                              fileList={fileList}
                              onChange={onChange}
                              beforeUpload={beforeUpload} 
                              maxCount={10}
                              showUploadList={false}
                            >
                              {fileList.length < 10 && (
                                <div className="flex flex-col gap-2 items-center">
                                  <UploadSvg />
                                  <p className="text-textSecondary font-nerisSemiBold">
                                    Drag & Drop a file here <br /> or click
                                  </p>
                                </div>
                              )}
                            </Upload>
                            {/* </ImgCrop> */}
                            <div className="mt-2 text-sm text-gray-600">
                              {fileList.length > 0 && (
                                <div className="mt-4">
                                  <List
                                    size="small"
                                    dataSource={fileList}
                                    renderItem={(file) => (
                                      <List.Item
                                        actions={[
                                          <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemove(file)}
                                          />,
                                        ]}
                                      >
                                        <List.Item.Meta
                                          title={
                                            <span className="truncate max-w-[180px] inline-block">
                                              {file.name}
                                            </span>
                                          }
                                          description={`${(
                                            file.size / 1024
                                          ).toFixed(1)} KB`}
                                        />
                                      </List.Item>
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Health Conditions & Symptoms */}
                        <div className="flex gap-2 items-start flex-col my-6 md:col-span-2">
                          <label className="text-textPrimary font-nerisSemiBold">
                            Health Conditions & Symptoms
                            <span className="text-[#FF3B30]"> * </span>
                          </label>
                          <textarea
                            {...register("healthConditionsAndSymptoms", {
                              required: true,
                            })}
                            placeholder="Describe your health conditions & symptoms details"
                            className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] h-30"
                          />
                          {errors.healthConditionsAndSymptoms && (
                            <span className="text-red-500">
                              Health Conditions is required
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 items-start flex-col mt-6 md:col-span-2">
                          <label className="text-textPrimary font-nerisSemiBold">
                            Past Medical Conditions / History (Optional)
                          </label>
                          <textarea
                            {...register("pastMedicalConditionsHistory", {
                              required: false,
                            })}
                            placeholder="Describe your past medical conditions / history details"
                            className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] h-30"
                          />
                        </div>

                        {/* Allergies (Optional)
                         */}
                        <div className="flex gap-2 items-start flex-col mt-6 md:col-span-2">
                          <label className="text-textPrimary font-nerisSemiBold">
                            Allergies (Optional)
                          </label>
                          <textarea
                            {...register("allergies", {
                              required: false,
                            })}
                            placeholder="Describe your existing allergies to substances if any"
                            className="text-textSecondary font-Poppins font-light outline outline-[#E5E5E5] bg-white rounded-md px-4 py-3 w-full focus:outline-[#1677ff] h-30"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center mt-10">
                        <Button
                          // onClick={submitPrescription}
                          htmlType="submit"
                          className="!bg-primaryColor md:!h-12 !h-8 !rounded-xl !text-white !font-nerisLight !font-semibold hover:!scale-105 !transition-all !duration-300 !w-fit !mx-auto"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </Modal>
          </Flex>

          <Link to="/request-rx-refill">
            <Button className="!bg-transparent md:!h-12 !h-8 !rounded-xl !font-nerisLight !font-semibold !border-primaryColor !text-primaryColor hover:!bg-primaryColor !transition-all !duration-300 hover:!text-white hover:!scale-105">
              Request For RX Refill
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
