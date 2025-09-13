import { Link } from "react-router";

const Return = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <p className="text-3xl font-semibold">Stipe Account Connected</p>
      <Link
        to={"/provider-setting/payment"}
        className="cursor-pointer px-5 py-2 bg-primaryColor text-white rounded-xl"
      >
        Go to dashboard
      </Link>
    </div>
  );
};

export default Return;
