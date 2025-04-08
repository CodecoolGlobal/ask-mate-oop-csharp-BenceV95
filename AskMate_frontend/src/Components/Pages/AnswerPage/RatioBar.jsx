import React, { useState } from 'react';
import './RatioBar.css';

export default function RatioBar({ voteData, displayNumberOfVotes = false }) {

    const total = voteData.length;

    let greenValue = voteData.filter(vote => vote.isUseful).length;
    let redValue = total - greenValue;


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
            {displayNumberOfVotes ? <div> You've got {total} votes on your answers. {total > 0 && <> <br /> A {greenPercentage.toFixed(2)}% of them appear to be useful for others!</>}  </div> : <span className='total-ratings'> Total ratings: {total}</span>}
        </div>
    );
}