import React, { useEffect, useState } from "react";
import "../../constants/styles/Toast.css";

interface ToastProps {
  message: React.ReactNode;
  show: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  show,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <div className={`toast ${visible ? "show" : "hide"}`}>
      {message}
    </div>
  );
};