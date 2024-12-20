import { AuthContext } from "../../AuthContext/AuthContext"
import React from "react"



export default function MainPage() {
    const { loggedInUsername, isLoggedIn } = React.useContext(AuthContext)
    return (
        <>
            Hello, {loggedInUsername}.
        </>
    )
}