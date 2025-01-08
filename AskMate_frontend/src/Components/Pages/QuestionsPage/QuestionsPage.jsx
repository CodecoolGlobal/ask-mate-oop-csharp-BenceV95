import { useContext, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';

export default function QuestionsPage({ questions, categories }) {
    const { isLoggedIn } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState(0);

    console.log(questions);

    const findCategoryNameById = (id) => {
        const res = categories.find(x=>x.id == id);
        return res.name;
    }

    const filterQuestionsByTag = (id) => {
        const res = questions.filter(x=>x.categories == id);
        console.log(res);
        
    }

    const deleteQuestion = (id) => {
            // fetch delete here
    }

    /* 
    The plan is to use media query breakpoints
    so that the website looks appealing and has great ratios
    for all screens. ask a mentor for help.
    */
    return (
        <>
            {isLoggedIn ?
                <div className="mainDiv">

                    <div className="categoriesDiv">
                        <Tags
                         categories={categories}
                         selector={setSelectedCategory}
                         filter={filterQuestionsByTag}
                        />
                    </div>

                    <div className="questionsDiv">
                        {questions.map(question => {
                            return <div key={question.id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{question.title}</h5>
                                    <p className="card-text">{question.body}</p>
                                    <i>Tag: {findCategoryNameById(question.categories)}</i><br></br>
                                    <a href="#" className="btn btn-primary">Answer</a>
                                    <button className="btn btn-danger" id={question.id} onClick={(e) => deleteQuestion(e.target.id)}>Delete</button>
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="askAQuestionDiv">
                        <a className="btn btn-warning" href="/ask">Ask a Question</a>
                    </div>
                </div> : <Navigate to={"/error"} />}
        </>
    )
}