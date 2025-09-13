import { PulseLoader } from "react-spinners";
import { cn } from "../../lib/utils";

interface Props {
  color?: string;
  className?: string;
  size?: number;
}

const Loader = ({ color, className, size = 10 }: Props) => {
  return (
    <div className={cn("", className)}>
      <PulseLoader
        color={color || "white"}
        size={size || "10"}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
