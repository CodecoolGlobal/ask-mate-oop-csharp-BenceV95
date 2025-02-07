import { useEffect, useState } from "react"
import "./Vote.css"

export default function Vote({ voteData, user, answer, setFetchVotesAgain }) {
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
            const response = await fetch(`/api/vote/change/${usersVote.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", // Optional if the body is empty
                }
            });

            if (response.ok) {
                console.log("Vote changed successfully!");
            } else {
                const errorText = await response.text();
                console.error("Failed to change vote:", errorText);
            }
        } catch (error) {
            console.error("Error in request:", error);
        }
    }


    async function sendVote(likeOrDislike) {
        const response = await fetch(`/api/vote`, {
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

    async function deleteVote() {
        try {
            const response = await fetch(`/api/votes/delete/${usersVote.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                console.log("Vote deleted successfully!");
            } else {
                const errorText = await response.text();
                console.error("Failed to delete vote:", errorText);
            }
        } catch (error) {
            console.error("Error in request:", error);
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