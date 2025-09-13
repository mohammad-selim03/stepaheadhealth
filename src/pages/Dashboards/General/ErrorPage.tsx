import { Button } from "antd"; 
import { Link } from "react-router";

function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-4xl font-semibold">Page Not found.!</h1>
        <Link to={"/"}>
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
