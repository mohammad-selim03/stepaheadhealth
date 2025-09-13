import { useQuery } from "@tanstack/react-query";
import CartSection from "../../../components/Dashboards/patientDashboard/payments/CartSection";
import TableItem from "../../../components/Dashboards/patientDashboard/payments/TableItem";
import { GetData } from "../../../api/API";
import Loader from "../../../components/common/Loader";

const Payments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentsInfo"],
    queryFn: () => GetData("payment/patient/transactions"),
  });
  return isLoading ? (
    <p className="flex items-center justify-center h-screen">
      <Loader color="#000000"/>
    </p>
  ) : error ? (
    <p>Someting went wrong</p>
  ) : (
    <div
      className="px-2 no-scrollbar overflow-y-auto pb-5"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      <CartSection data={data} />
      <TableItem data={data} />
    </div>
  );
};

export default Payments;
