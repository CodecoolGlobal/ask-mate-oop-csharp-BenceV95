import { useState } from "react"

export default function RegistrationForm({ registerNewUser }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <form onSubmit={(e) => { registerNewUser(e, username, email,password) }}>
                <label htmlFor="username">Username: </label>
                <input onChange={(e) => { setUsername(e.target.value) }} type='text' id="username" name="username" /> <br />
                <label htmlFor="email">Email: </label>
                <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" /> <br />
                <label htmlFor="pw">Password: </label>
                <input onChange={(e) => { setPassword(e.target.value) }} type="password" id="pw" name="pw" /> <br />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}