import { useEffect, useState } from "react"
import "./Vote.css"

export default function Vote({ voteData, user, answer, setFetchVotesAgain }) {
    const [usersVote, setUsersVote] = useState(null);

    async function handleLikeAnswer(e) {
        e.preventDefault();
        if (!usersVote) {
            await sendVote(true)
            setFetchVotesAgain((prevState) => !prevState)
        }
    }

    async function handleDislikeAnswer(e) {
        e.preventDefault();
        if (!usersVote) {
            await sendVote(false)
            setFetchVotesAgain((prevState) => !prevState)
        }
    }

    useEffect(() => {
        let usersVote = voteData.find(vote => vote.userId == user.id);
        setUsersVote(usersVote)
    }, [voteData])


    async function changeVote(params) {
        const response = await fetch(`http://localhost:5166/vote/change/${voteId}`)
    }


    async function sendVote(likeOrDislike) {
        const response = await fetch(`http://localhost:5166/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answerId: `${answer.id}`, //didnt work just as a template literal
                userId: `${user.id}`,
                isUseful: likeOrDislike
            })
        });
        if (response.ok) {
            console.log("like vote successfully sent!")
        } else {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
    }

    return (
        <div className="voteDiv">
            Was this answer useful?
            <button
                onClick={(e) => handleLikeAnswer(e)}
                className={`btn ${usersVote?.isUseful ? "btn-success" : "btn-light"}`}>
                Yes
            </button>
            <button
                onClick={(e) => handleDislikeAnswer(e)}
                className={`btn ${(usersVote == null || usersVote?.isUseful) ? "btn-light" : "btn-danger"}`}>
                No
            </button>
        </div>
    )
}