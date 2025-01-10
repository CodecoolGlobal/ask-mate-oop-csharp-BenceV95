import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';
import SearchDiv from "./SearchDiv";

export default function QuestionsPage({ questions, categories, setQuestions }) {

    const { user } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchedWords, setSearchedWords] = useState("");
    console.log("user:", user)

    useEffect(() => {
        if (selectedCategory === 0 && searchedWords === "") {
            setFilteredQuestions(questions)
        } else {
            const filteredByTag = filterQuestionsByTag(selectedCategory);
            const filteredByWords = filterByWords(filteredByTag, searchedWords);
            setFilteredQuestions(filteredByWords)
        }
    }, [questions, searchedWords, selectedCategory]);


    //basic search algorithm
    function filterByWords(halfFiltered, words) {
        if (words) {
            return halfFiltered.filter(question => question.body.toLowerCase().includes(words.toLowerCase()) || question.title.toLowerCase().includes(words.toLowerCase()));
        }
        return halfFiltered;
    }


    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
        return result.name;
    }

    const filterQuestionsByTag = (id) => {
        if (id === 0) {
            return questions;
        }
        const filtered = questions.filter((question) => question.categories === id);
        console.log(filtered);
        return filtered;
    }

    // filtering does not work well yet
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

    /* 
    The plan is to use media query breakpoints
    so that the website looks appealing and has great ratios
    for all screens. ask a mentor for help.
    */
    console.log("Searched:", searchedWords)
    return (
        <>
            {user.isLoggedIn ?
                <div className="mainDiv">

                    <div className="categoriesDiv">
                        <Tags
                            categories={categories}
                            selector={setSelectedCategory}
                            filter={filterQuestionsByTag}
                        />
                    </div>

                    <div className="questionsDiv">
                        {filteredQuestions.map(question => {
                            return <div key={question.id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{question.title}</h5>
                                    <p className="card-text">{question.body}</p>
                                    <i>Tag: {findCategoryNameById(question.categories)}</i><br></br>
                                    <a href={`/questions/${question.id}`} className="btn btn-primary">Answer</a>
                                    {question.userId === user.id && <button className="btn btn-danger" id={question.id} onClick={(e) => deleteQuestion(e.target.id)}>Delete</button>}
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="askAQuestionDiv">
                        <a className="btn btn-warning" href="/ask">Ask a Question</a>
                        <SearchDiv setSearchedWords={setSearchedWords} />
                    </div>
                </div>
                :
                <Navigate to={"/error"} />
            }
        </>
    )
}