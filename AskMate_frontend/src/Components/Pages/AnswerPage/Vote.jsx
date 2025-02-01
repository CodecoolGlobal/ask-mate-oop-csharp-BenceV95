import "./Vote.css"

export default function Vote() {

    function handleLikeAnswer() {
        console.log("i like")
    }
    function handleDislikeAnswer() {
        console.log("i dislike")
    }


    return (
        <div className="voteDiv">
            Was this answer useful?
            <button onClick={handleLikeAnswer} className="btn btn-success">Yes</button>
            <button onClick={handleDislikeAnswer} className="btn btn-danger">No</button>
        </div>
    )
}