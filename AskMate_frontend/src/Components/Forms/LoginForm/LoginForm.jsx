import React, { useState, useEffect } from 'react';
import './LoginForm.css';


export default function LoginForm({ navigate, loginUser }) {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(username, password); // Call loginUser with form data
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className='login'>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username/email" /> <br />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" /> <br />
                <button type='submit' className='btn btn-success'>Login</button>
            </form>
            <br></br>
            <a href="/register">Don't have an account?</a> <br />
        </div >
    )
}

