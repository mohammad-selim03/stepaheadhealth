import { createContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type DataType = Record<string, unknown>;

interface MainContextType {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  step1: number;
  setStep1: Dispatch<SetStateAction<number>>;
  data: DataType;
  setData: Dispatch<SetStateAction<DataType>>;
  title: string | null;
  setTitle: Dispatch<SetStateAction<string | null>>; // add this
  id: string;
  setId: string;
}

export const MainContext = createContext<MainContextType | null>(null);

interface Props {
  children: ReactNode;
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days = 7): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

function ContextProvider({ children }: Props) {
  const [step, setStep] = useState<number>(parseInt(getCookie("step") || "0"));
  const [step1, setStep1] = useState<number>(
    parseInt(getCookie("step1") || "0")
  );
  const [title, setTitle] = useState(() => {
    return JSON.parse(localStorage.getItem("title") || "null") || "Dashboard";
  });

  const [id, setId] = useState("");
  // provider steps data
  const [data, setData] = useState<DataType>({});
  console.log("cotext  data", data);

  useEffect(() => {
    setCookie("step", step.toString());
  }, [step]);

  useEffect(() => {
    setCookie("step1", step1.toString());
  }, [step1]);

  const mainStateInfo: MainContextType = {
    step,
    setStep,
    step1,
    setStep1,
    data,
    setData,
    title,
    setTitle,
    id,
    setId,
  };

  console.log("tile", title);

  return (
    <MainContext.Provider value={mainStateInfo}>
      {children}
    </MainContext.Provider>
  );
}

export default ContextProvider;
