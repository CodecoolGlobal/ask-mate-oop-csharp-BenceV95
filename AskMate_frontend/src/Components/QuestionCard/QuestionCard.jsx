import { Link } from "react-router-dom";
import "./QuestionCard.css"

export default function QuestionCard({ question, categories, user }) {

    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
        return result.name;
    }

    return (
        <div key={question.id} className="card">
            <div className="card-body">
                <h5 className="card-title">{question.title}</h5>
                <p className="card-text">{question.body}</p>
                <i>Tag: {findCategoryNameById(question.categories)}</i><br />
                <b>Answers:{question.relatedAnswerCount}</b> <br />
                <Link
                    to={`/questions/${question.id}`}
                    className="btn btn-primary">
                    {question.userId === user.id ? "Check my Question" : "Answer"}
                </Link>



            </div>
        </div>
    )
}