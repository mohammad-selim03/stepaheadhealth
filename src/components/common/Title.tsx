import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

const Title = ({ children, className }: Props) => {
  return <h3 className={cn("text-3xl md:text-[38px]", className)}>{children}</h3>;
};

export default Title;
