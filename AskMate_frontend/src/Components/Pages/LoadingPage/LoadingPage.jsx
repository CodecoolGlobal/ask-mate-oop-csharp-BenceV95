// LoadingPage.jsx
import React from 'react';
import "./LoadingPage.css"

export default function LoadingPage() {
    return (
        <div className='loading'>
            <div className="loading-spinner">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
            </div>
            <p>Loading...</p>
        </div>
    );
};
