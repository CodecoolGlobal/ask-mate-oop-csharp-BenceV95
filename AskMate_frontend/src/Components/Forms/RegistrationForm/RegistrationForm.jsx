import React, { useState } from "react";
import './RegistrationForm.css';
import { apiPost } from "../../../utils/api";

export default function RegistrationForm({ navigate }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [reg, setReg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function registerNewUser(e) {

        e.preventDefault();
        setLoading(true);
        setError(false);
        setResponseMessage("");

        try {
            //return the id
            const response = await apiPost('/User', { username, email, password });
           
            setResponseMessage('Registration successful!\nLog in below');
            setReg(true);

        } catch (error) {
            console.log(error);
            setReg(false);
            setError(true);
            setResponseMessage(error.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="register-container border border-white rounded p-3">
                <form onSubmit={(e) => { registerNewUser(e, username, email, password) }}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input onChange={(e) => { setUsername(e.target.value) }}
                            type='text'
                            id="username"
                            name="username"
                            placeholder="Username"
                            className="form-control"
                            required
                            minLength={3}
                            maxLength={20}
                            disabled={reg}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            required
                            disabled={reg}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pw" className="form-label">Password</label>
                        <input onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            id="pw"
                            name="pw"
                            placeholder="Password"
                            className="form-control"
                            required
                            minLength={6}
                            maxLength={24}
                            disabled={reg}
                        />
                    </div>
                    {
                        loading ?
                            (<button className="btn btn-success" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Loading...</span>
                            </button>)
                            :
                            (<button
                                type="submit"
                                className="btn btn-success"
                                disabled={reg}
                            >Register</button>)
                    }

                </form>
                <div className="container mt-5">
                    <p style={{ color: error ? "#dc3545" : "#28a745" }}>{responseMessage}</p>
                </div>

                {
                    reg ?
                        <button className="btn btn-success" onClick={() => navigate("/login")}>Log In Here</button>
                        :
                        <button className="btn btn-warning" onClick={() => navigate(-1)}>Back</button>
                }
            </div>
        </>
    )
}