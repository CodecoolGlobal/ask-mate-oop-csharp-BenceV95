import { useState } from "react";
import './RegistrationForm.css';
import { apiPost } from "../../../utils/api";

export default function RegistrationForm({ navigate }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [reg, setReg] = useState(false);

    async function registerNewUser(e) {

        e.preventDefault();

        try {
            const response = await apiPost('/User', { username, email, password });

            setResponseMessage('Registration successful!\nLog in below');
            setReg(true);

        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('An error occurred while registering.');
        };
    }

    return (
        <div>
            <form onSubmit={(e) => { registerNewUser(e, username, email, password) }} className="register">

                <input onChange={(e) => { setUsername(e.target.value) }} type='text' id="username" name="username" placeholder="Username" />

                <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" placeholder="Email" />

                <input onChange={(e) => { setPassword(e.target.value) }} type="password" id="pw" name="pw" placeholder="Password" /> <br />
                <button type="submit" className="btn btn-success">Register</button>
            </form>
            <p>{responseMessage}</p>
            {
                reg ?
                    <button className="btn btn-success" onClick={() => navigate("/login")}>Log In Here</button>
                    :
                    <button className="btn btn-warning" onClick={() => navigate(-1)}>Back</button>
            }
        </div>
    )
}