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
            console.log("fresh session data: ",data);
            
            if(data.isLoggedIn == true){
                console.log("Is the user logged in? ", data.isLoggedIn);
                if (sessionStorage.getItem("user").id === data.id) {
                    console.log("User is already logged in, no need to update state.");
                    return;                    
                }
                sessionStorage.setItem("user", JSON.stringify(data));
                setUser(data);
                                
            } else {
                sessionStorage.removeItem("user");
                setUser(null);                
            }
            
        }
        //setIsLoading(true);
        fetchLoginStatus();
        //setIsLoading(false);
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