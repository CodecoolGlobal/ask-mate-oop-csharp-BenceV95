import { useContext } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"

export default function QuestionsPage({ questions, categories }) {
    const { isLoggedIn } = useContext(AuthContext)

    return (
        <>
            {isLoggedIn ?
                <>
                <div>
                    <a className="btn btn-warning" href="/ask">Ask a Question</a>
                </div>
                    {questions.map(question => {
                        return <div key={question.id} className="card" style={{ width: `${24}rem` }}>
                            <div className="card-body">
                                <h5 className="card-title">{question.title}</h5>
                                <p className="card-text">{question.body}</p>
                                <a href="#" className="btn btn-primary">Answer</a>
                            </div>
                        </div>
                    })}
                    <Tags categories={categories} />
                </> : <Navigate to={"/error"} />}
        </>
    )
}