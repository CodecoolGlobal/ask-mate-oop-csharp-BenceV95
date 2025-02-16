import "./AnswerCard.css"


export default function AnswerCard({answer}) {
    return (
        <div className="answer-card-main">
            {answer.body}
        </div>
    )
}