import { useEffect, useState } from "react";
import React from "react";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";
import { apiGet, apiPost } from "../../utils/api";

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  //check the session when the component first mounts
  useEffect(() => {
    setIsLoading(true);
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
    setIsLoading(false);

  }, [user]);

  const loginContext = (userData) => {
    setUser(userData);
  };

  const logoutContext = async () => {
    try {
      const response = await apiPost("/User/logout");
      sessionStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.log("error", error);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, logoutContext, loginContext }}
    >
      {children}
    </AuthContext.Provider>
  );
}
