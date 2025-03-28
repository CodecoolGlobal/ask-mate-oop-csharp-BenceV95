import { useEffect, useState } from "react";
import React from "react";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";
import { apiGet } from "../../utils/api";


export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null);



    //check the session when the component first mounts
    useEffect(() => {
        async function fetchLoginStatus() {
            
            const userInStorage = JSON.parse(sessionStorage.getItem("user"));

            if(userInStorage){
                setUser(userInStorage);

            }else{
                setUser(null)
            }


            setIsLoading(false);
        }
        fetchLoginStatus();

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



//just to test the loading page
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}