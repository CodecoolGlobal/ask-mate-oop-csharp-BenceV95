import { AuthContext } from "../../AuthContext/AuthContext"
import React from "react"



export default function MainPage() {
    const { user } = React.useContext(AuthContext)
    return (
        <>
            Hello, {user.username}.
        </>
    )
}