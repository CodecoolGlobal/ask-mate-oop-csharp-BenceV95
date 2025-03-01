import Vote from "./Vote"
import RatioBar from "./RatioBar"
import { useEffect, useState } from "react";

import "./Answers.css"


export default function AnswerPage({ answers, getUsernameById, convertDate, user, op_id, isQuestionClosed }) {
    const [votes, setVotes] = useState([]);
    const [answerIds, setAnswerIds] = useState([]);
    const [fetchVotesAgain, setFetchVotesAgain] = useState(false);
    
    useEffect(() => {
        if (answers.length > 0) {
            setAnswerIds(answers.map(answer => answer.id));
        }
    }, [answers]);


    useEffect(() => {
        if (answerIds.length > 0) {
            fetchVotes().then(votes => setVotes(votes))
        }
    }, [answerIds, fetchVotesAgain]);

    


    async function fetchVotes() {
        const response = await fetch(`/api/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ answerIds: answerIds })
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error retriving votes data!")
        }
    }



    function filterAnswerVoteData(answerId) {
        return votes.filter(vote => vote.answerId == answerId)
    }

    const acceptAnswer = async (e) => {
        const id = e.target.id;
        console.log(id);
        try {
            const response = await fetch(`/api/Answer/Accept/${id}`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    
                },
                credentials: "include"        
            });
    
            if (!response.ok) {
                throw new Error(response.message);
            }

            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.log(error);
            
        }
        
    }

    return (
        <div className="answersDiv">
            {answers.map(answer => {
                return (<div key={answer.id} className={(isQuestionClosed && answer.isAccepted) ? ("answerCardDivAccepted") : (op_id == answer.userId ? ("answerCardDivOP") : ("answerCardDiv"))}>
                    <div className="answerCardHeader">                        
                        <span>{op_id == answer.userId && (<b>👑OP👑 </b>)}{getUsernameById(answer.userId)}'s answer:</span>
                        <i>{convertDate(answer.postDate)}</i>
                        {(answer.userId === user.id && !isQuestionClosed) &&
                            (<>
                                <button className="btn btn-danger">Delete</button>
                                <button className="btn btn-warning">Edit (WIP)</button>
                            </>)
                        }
                        {(op_id != answer.userId && !isQuestionClosed && user.id == op_id) && (<button className="btn btn-success" onClick={(e) => acceptAnswer(e)} id={answer.id}>Accept Answer</button>)}
                    </div>
                    <pre>{answer.body}</pre>
                    <div className="vote-ratio-bar-wrapper">
                        <RatioBar voteData={filterAnswerVoteData(answer.id)} isQuestionClosed={isQuestionClosed}/>
                        {answer.userId != user.id && <Vote setFetchVotesAgain={setFetchVotesAgain} answer={answer} voteData={filterAnswerVoteData(answer.id)} user={user} isQuestionClosed={isQuestionClosed}/>}
                    </div>
                </div>)
            })}
        </div>
    )
} 