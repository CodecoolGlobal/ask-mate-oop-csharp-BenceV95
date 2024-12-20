import { useContext } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"

export default function QuestionsPage({ questions }) {
    const { isLoggedIn } = useContext(AuthContext)
    return (
        <>
            {isLoggedIn ?
                <>
                    {questions.map(question => {
                        return <div key={question.id} className="card" style={{ width: `${24}rem` }}>
                            <div className="card-body">
                                <h5 className="card-title">{question.title}</h5>
                                <p className="card-text">{question.body}</p>
                                <a href="#" className="btn btn-primary">Answer</a>
                            </div>
                        </div>
                    })}
                </> : <Navigate to={"/error"} />}
        </>
    )
}