import "./Vote.css"

export default function Vote() {
    return (
        <div className="voteDiv">
            Was this answer useful?
            <button className="btn btn-success">Yes</button>
            <button className="btn btn-danger">No</button>
        </div>
    )
}