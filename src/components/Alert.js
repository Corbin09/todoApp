// Alert.js
import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../context/context";

const Alert = ({ msg }) => {
  const { alert, showAlert } = useGlobalContext();
  const alertRef = useRef(null); 

  useEffect(() => {
    if (alertRef.current) { 
      alertRef.current.style.left = `${alert.show ? "15px" : "-100%"}`;

      const timeout = setTimeout(() => {
        alertRef.current.style.left = "-100%";
        showAlert(false, alert.msg);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [alert, showAlert]); 
  return (
    <p ref={alertRef} className='alert'> 
      {msg}
    </p>
  );
};

export default Alert;