import { useState } from "react";
import './RegistrationForm.css';

export default function RegistrationForm({ registerNewUser }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <form onSubmit={(e) => { registerNewUser(e, username, email,password) }} className="register">

                <input onChange={(e) => { setUsername(e.target.value) }} type='text' id="username" name="username" placeholder="Username"/>

                <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" placeholder="Email"/>

                <input onChange={(e) => { setPassword(e.target.value) }} type="password" id="pw" name="pw" placeholder="Password"/> <br />
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    )
}