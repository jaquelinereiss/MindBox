import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "./Toast";

interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? <Toast message={message} /> : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
