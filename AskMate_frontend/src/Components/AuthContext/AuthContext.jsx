import { useEffect, useState } from "react";
import React from "react";
import LoadingPage from "../Pages/LoadingPage/LoadingPage";
import { apiGet } from "../../utils/api";


export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState({});


    // this is called when the user logs in or out...
    async function refreshSession() {
        setIsLoading(true);
        const status = await checkSession();
        setIsLoggedIn(status.isLoggedIn);
        setLoggedInUsername(status.username);
        setUserId(status.id)
        setUser({
            isLoggedIn: status.isLoggedIn,
            username: status.username,
            id: status.id,
            isAdmin: status.role === "admin" ? true : false
        })
        setIsLoading(false);
    };

    //check the session when the component first mounts
    useEffect(() => {
        async function fetchLoginStatus() {
            const status = await checkSession();
            //await delay(1000) //for testing
            console.log("status:", status)
            setIsLoggedIn(status.isLoggedIn)
            setLoggedInUsername(status.username)
            setUserId(status.id)
            setUser({
                isLoggedIn: status.isLoggedIn,
                username: status.username,
                id: status.id,
                isAdmin: status.role === "admin" ? true : false
            });
            setIsLoading(false);
            console.log("user", user)
        }
        fetchLoginStatus();
        console.log("useragain:", user)
    }, []);

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    return (
        <AuthContext.Provider value={{ refreshSession, loggedInUsername, isLoggedIn, setIsLoggedIn, userId, user }}>
            {children}
        </AuthContext.Provider>
    )

}




async function checkSession() {
    try {
        const data = await apiGet("/User/session");
        return data;
    } catch (e) {
        return {
            isLoggedIn: false,
            username: "Guest",
            isAdmin: false
        }
    }
}

//just to test the loading page
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}