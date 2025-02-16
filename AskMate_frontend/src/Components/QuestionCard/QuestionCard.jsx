import "./QuestionCard.css"

export default function QuestionCard({ question, categories, user, withButtons }) {

    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
        return result.name;
    }



    //this should trigger a fetch on questions
    const deleteQuestion = async (id) => {
        const updatedData = questions.filter((question) => question.id !== id);
        setQuestions(updatedData);
        setFilteredQuestions(updatedData);
        try {
            const response = await fetch(`http://localhost:5166/Answer/all/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });

            if (response.ok) {
                try {

                    const response = await fetch(`http://localhost:5166/Question/${id}`, {
                        method: 'DELETE',
                        credentials: "include"
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok!");
                    }
                } catch (e) { console.log(e) }
            }
            console.log("delete successful");

        } catch (error) {
            console.log("delete failed:", error);
        }
    }



    return (
        <div key={question.id} className="card">
            <div className="card-body">
                <h5 className="card-title">{question.title}</h5>
                <p className="card-text">{question.body}</p>
                <i>Tag: {findCategoryNameById(question.categories)}</i><br />
                <b>Answers:{question.relatedAnswerCount}</b> <br />
                {withButtons &&
                    <>
                        <a href={`/questions/${question.id}`} className="btn btn-primary">Answer</a>
                        {question.userId === user.id && <button className="btn btn-danger m-1" id={question.id} onClick={(e) => deleteQuestion(e.target.id)}>Delete</button>}
                    </>
                }

            </div>
        </div>
    )
}