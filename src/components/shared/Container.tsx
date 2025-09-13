import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-[1480px] mx-auto px-5 4xl:px-0", className)}>{children}</div>
  );
}

export default Container;
