import React, { useLayoutEffect, useState } from "react";
import UserContext from "./Context";
import jwtDecode from "jwt-decode";

const Provider = ({ children }) => {
  const [userData, setUserData] = useState(()=>{
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      const data = token && (jwtDecode(token) || null);
      return {
        isAuth: !!data,
        user: data,
      };
    } else {
      return {
        isAuth: false,
        user: null,
      };
    }
  });
  const [actions] = useState({ login, logout });
  const [isDoneUserChecking, setIsDoneUserChecking] = useState(false);

  function login(data) {
    const user_data = data?.token && (jwtDecode(data.token) || null);
    setUserData({ isAuth: true, user: user_data });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUserData({ isAuth: false, user: null });
  }

  useLayoutEffect(() => {
    setIsDoneUserChecking(true);
  }, []);

  return (
    <UserContext.Provider
      value={{
        state: userData,
        actions,
        isDoneUserChecking,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default React.memo(Provider);
