import { useEffect, useState } from "react"
import "./Vote.css"
import { apiDelete, apiPost, apiPut } from "../../../utils/api";

export default function Vote({ voteData, user, answer, setFetchVotesAgain, isQuestionClosed }) {
    const [usersVote, setUsersVote] = useState(null);

    async function handleLikeAnswer(e) {
        e.preventDefault();
        if (!usersVote) {
            //if the user didnt vote on the question
            await sendVote(true)
        } else if (!usersVote.isUseful) {
            //if the user voted on the oppoiste value first
            await changeVote()
        } else {
            //if user clicks on the same vote as he clicked previously
            await deleteVote()
        }
        //re-fetch votes to render them properly
        setFetchVotesAgain((prevState) => !prevState)
    }

    async function handleDislikeAnswer(e) {
        e.preventDefault();
        if (!usersVote) {
            await sendVote(false)
        } else if (usersVote.isUseful) {
            await changeVote()
        } else {
            await deleteVote()
        }
        setFetchVotesAgain((prevState) => !prevState)
    }

    useEffect(() => {
        let usersVote = voteData.find(vote => vote.userId == user.id);
        setUsersVote(usersVote)
    }, [voteData])


    async function changeVote() {
        try {
            const response = await apiPut(`/vote/change/${usersVote.id}`);

        } catch (error) {
            console.error("Error in request:", error);
        }
    }


    async function sendVote(likeOrDislike) {
        try {
            const response = await apiPost(`/vote`, {
                answerId: `${answer.id}`,
                userId: `${user.id}`,
                isUseful: likeOrDislike
            });

        } catch (e) {
            console.log(e);
        }

    }

    async function deleteVote() {
        try {
            const response = await apiDelete(`/api/votes/delete/${usersVote.id}`);

        } catch (error) {
            console.error("Error in request:", error);
        }
    }




    return (
        <div className="voteDiv">
            Was this answer useful?
            <button
                onClick={(e) => handleLikeAnswer(e)}
                disabled={isQuestionClosed}
                className={`btn ${usersVote?.isUseful ? "btn-success" : "btn-light"}`}
            >
                Yes
            </button>
            <button
                onClick={(e) => handleDislikeAnswer(e)}
                disabled={isQuestionClosed}
                className={`btn ${(usersVote == null || usersVote?.isUseful) ? "btn-light" : "btn-danger"}`}
            >
                No
            </button>
        </div>
    )
}