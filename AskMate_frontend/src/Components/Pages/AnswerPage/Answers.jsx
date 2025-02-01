import Vote from "./Vote"
import RatioBar from "./RatioBar"
import { useState } from "react";

import "./Answers.css"


export default function AnswerCard({ answers, getUsernameById, convertDate, user }) {
    const [greenValue, setGreenValue] = useState(0);
    const [redValue, setRedValue] = useState(0);


    return (
        <div className="answersDiv">
            {answers.map(answer => {
                return (<div key={answer.id} className="answerCardDiv" >
                    <div className="answerCardHeader">
                        <p>{getUsernameById(answer.userId)}'s answer:</p>
                        <i>{convertDate(answer.postDate)}</i>
                        {answer.userId === user.id ?
                            (<>
                                <button className="btn btn-danger">Delete</button>
                                <button className="btn btn-warning">Edit (WIP)</button>
                            </>) : <Vote />}
                    </div>
                    <pre>{answer.body}</pre>
                    <RatioBar greenValue={greenValue} redValue={redValue} />
                </div>)
            })}
        </div>
    )
}



