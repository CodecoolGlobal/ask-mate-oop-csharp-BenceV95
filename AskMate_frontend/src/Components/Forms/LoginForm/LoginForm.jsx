import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './LoginForm.css';


export default function LoginForm({ navigate, loginUser }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginUser(username, password); // Call loginUser with form data        
        setResponse(response.message);
    };


    return (
        <div className='custom-container border border-white rounded p-3'>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="Email" className="form-label">Email address / Username</label>
                    <input type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username / Email"
                        required
                        minLength={3}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        className="form-control"
                        required
                        minLength={6}
                        maxLength={24}
                    />

                </div>
                <button type='submit' className='btn btn-success'>Login</button>
            </form>
            <div className='container mt-3'>
                <p style={{color: "red"}}>{response}</p>
            </div>
            <div className='container mt-5'>
                <Link to="/register"
                    className='btn btn-primary'
                >Don't have an account?</Link>
            </div>
        </div >
    )
}

