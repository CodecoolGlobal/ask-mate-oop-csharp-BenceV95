import { AuthContext } from "../../AuthContext/AuthContext"
import React from "react"
import { Link } from "react-router-dom"


export default function MainPage() {
    const { user } = React.useContext(AuthContext)
    return (
        <div className="mainPage">
            <h4>Hello, {user?.username || "Guest"}.</h4>
            <h1>Welcome to AskApe [ESC]</h1>
            <p>
                AskApe is a Q&A site where you can ask questions and get answers from other users.<br />
                You can also answer questions and vote on the best answers.
            </p>
            <div style={{ backgroundColor: "#333" }} className="rounded p-1">
                <p className="text-warning">
                    🚧👷‍♂️<br />
                    The site is under development and is <b>NOT</b> optimised for mobile 📱<br />
                    👷‍♂️🚧
                </p>
                <p className="text-danger">
                    Before using the site please read<br />
                    <Link to="/tos" className="btn btn-danger">Terms & Conditions</Link>
                </p>
            </div>

        </div>
    )
}