import Billing from "../../../components/Dashboards/patientDashboard/rxSteps/Billing";

const BillingAndPayment = () => {
  return (
    <div
        className="px-2 no-scrollbar overflow-y-auto pb-5"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
      <Billing />
    </div>
  );
};

export default BillingAndPayment;
