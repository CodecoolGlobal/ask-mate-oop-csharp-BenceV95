import React, { useState, useEffect } from 'react';



export default function LoginForm({ navigate, loginUser }) {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(username, password); // Call loginUser with form data
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username/email" /> <br />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" /> <br />
                <button type='submit' >Login</button>
            </form>
            <a href="/register">Don't have an account?</a> <br />
            <button onClick={() => navigate(-1)}>Back</button>
        </div >
    )
}

