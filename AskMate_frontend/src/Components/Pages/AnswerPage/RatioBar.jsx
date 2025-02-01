import React, { useState } from 'react';
import './RatioBar.css';

export default function RatioBar({ greenValue, redValue }) {
  // Calculate the total value
  const total = greenValue + redValue;

  // Calculate the percentage of green and red
  const greenPercentage = (greenValue / total) * 100;
  const redPercentage = (redValue / total) * 100;

  return (
    <div className='ratio-bars-main'>
    <div className="ratio-bars">
      <div
        className="green-bar"
        style={{ width: `${greenPercentage}%` }}
      />
      <div
        className="red-bar"
        style={{ width: `${redPercentage}%` }}
      />
    </div>
    </div>
  );
}