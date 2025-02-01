import React, { useState } from 'react';
import './RatioBar.css';

export default function RatioBar({ greenValue, redValue }) {
    const total = greenValue + redValue;

    //to display  a basic bar even if both numbers are 0
    const greenPercentage = (greenValue == 0 && redValue == 0) ? 100 : (greenValue / total) * 100;
    const redPercentage = (redValue == 0 && greenValue == 0) ? 100 : (redValue / total) * 100;

    return (
        <div className='ratio-bars-main'>
            <div className="ratio-bars">
                <div className="green-bar" style={{ width: `${greenPercentage}%` }}>
                </div>
                <div className="red-bar" style={{ width: `${redPercentage}%` }}>
                </div>
            </div>
            <span className='total-ratings'> Total ratings: {total}</span>
        </div>
    );
}