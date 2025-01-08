import { useContext, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';

export default function QuestionsPage({ questions, categories }) {
    const { isLoggedIn } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState(0);

    console.log(categories);

    const findCategoryNameById = (id) => {
        const res = categories.find(x=>x.id == id);
        return res.name;
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
                        <Tags categories={categories} selector={setSelectedCategory}/>
                    </div>

                    <div className="questionsDiv">
                        {questions.map(question => {
                            return <div key={question.id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{question.title}</h5>
                                    <p className="card-text">{question.body}</p>
                                    <p>Tag: {findCategoryNameById(question.categories)}</p>
                                    <a href="#" className="btn btn-primary">Answer</a>
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