import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';
import SearchDiv from "./SearchDiv";

export default function QuestionsPage({ questions, categories }) {

    const { isLoggedIn } = useContext(AuthContext)
    // const [selectedCategory, setSelectedCategory] = useState(0); this is not used as well
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchedWords, setSearchedWords] = useState("");

    useEffect(() => {
        const filteredByWords = filterByWords(filteredQuestions, searchedWords)
        setFilteredQuestions(filteredByWords); //it was previously questions 
    }, [questions, searchedWords]);


    //basic search algorithm

    //there is a bug, when u select a category, search by a word, then delete the word, all the questions are displayed, not just the one from the selected category
    function filterByWords(questions, words) {
        if (!words) {
            return questions;
        }
        return questions.filter(question => question.body.toLowerCase().includes(words.toLowerCase()) || question.title.toLowerCase().includes(words.toLowerCase()));
    }


    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
        return result.name;
    }

    const filterQuestionsByTag = (id) => {
        if (id === "any") {
            setFilteredQuestions(questions);
            return;
        }
        const filtered = questions.filter((question) => question.categories === id);
        console.log(filtered);
        setFilteredQuestions(filtered);
    }

    // filtering does not work well yet
    const deleteQuestion = async (id) => {
        const updatedData = questions.filter((question) => question.id !== id);
        setFilteredQuestions(updatedData);
        try {
            const response = await fetch(`http://localhost:5166/Question/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error: ${response.status} - ${errorText}`);
                throw new Error("Network response was not ok!");
            }
            console.log("delete successful");
        }
        catch (error) {
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
            {isLoggedIn ?
                <div className="mainDiv">

                    <div className="categoriesDiv">
                        <Tags
                            categories={categories}
                            // selector={setSelectedCategory} unused
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
                                    <a href="#" className="btn btn-primary">Answer</a>
                                    {question.id === "userIdHere" && <button className="btn btn-danger" id={question.id} onClick={(e) => deleteQuestion(e.target.id)}>Delete</button>}

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