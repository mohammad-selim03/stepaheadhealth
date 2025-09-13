import { Link } from "react-router";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-2xl font-semibold">
      <p className="text-3xl">Congratulations, Payment Success.!</p>

      <div className="py-10 flex items-center justify-center">
        <Link
          to={"/provider-dashboard"}
          className="bg-primaryColor px-5 py-2 rounded-xl text-lg text-white"
        >
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Success;
