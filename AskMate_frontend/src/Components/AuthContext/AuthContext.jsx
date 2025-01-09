import { useEffect, useState } from "react";
import React from "react";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";


export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [userId, setUserId] = useState("");


    // this is called when the user logs in or out...
    async function refreshSession() {
        setIsLoading(true);
        const status = await checkSession();
        setIsLoggedIn(status.isLoggedIn);
        setLoggedInUsername(status.username);
        setUserId(status.id)
        setIsLoading(false);
    };

    //check the session when the component first mounts
    useEffect(() => {
        async function fetchLoginStatus() {
            const status = await checkSession();
            await delay(1000) //for testing
            console.log("status:", status)
            setIsLoggedIn(status.isLoggedIn)
            setLoggedInUsername(status.username)
            setUserId(status.id)
            setIsLoading(false)
        }
        fetchLoginStatus();
    }, []);

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    return (
        <AuthContext.Provider value={{ refreshSession, loggedInUsername, isLoggedIn, setIsLoggedIn, userId }}>
            {children}
        </AuthContext.Provider>
    )

}




async function checkSession() {
    const response = await fetch("http://localhost:5166/User/session", {
        method: "GET",
        credentials: "include", // Include cookies with the request
    });

    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        return {
            isLoggedIn: false,
            username: "Guest"
        }
    }
}

//just to test the loading page
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}