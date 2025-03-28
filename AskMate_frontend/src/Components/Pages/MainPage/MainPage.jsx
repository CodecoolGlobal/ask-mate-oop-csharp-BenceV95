import { AuthContext } from "../../AuthContext/AuthContext"
import React from "react"



export default function MainPage() {
    const { user } = React.useContext(AuthContext)
    return (
        <div className="mainPage">
            <h4>Hello, {user?.username || "Guest"}.</h4>
            <h1>Welcome to AskMate</h1>
            <p>
                AskMate is a Q&A site where you can ask questions and get answers from other users.<br />
                You can also answer questions and vote on the best answers.
            </p>
        </div>
    )
}