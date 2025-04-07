import { useEffect, useState } from "react";
import React from "react";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";
import { apiGet } from "../../utils/api";


export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null);

    //check the session when the component first mounts
    useEffect(() => {
        
        async function fetchLoginStatus() {            
            //const userInStorage = JSON.parse(sessionStorage.getItem("user"));
            const data = await apiGet(`User/session`);
            console.log("session data: ",data);
            
            if(data.isLoggedIn == true){
                sessionStorage.setItem("user", JSON.stringify(data));
                setUser(data);
                console.log("Is the user logged in? ", data.isLoggedIn);
                                
            } else {
                sessionStorage.removeItem("user");
                setUser(null);                
            }
            
        }
        setIsLoading(true);
        fetchLoginStatus();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )

}