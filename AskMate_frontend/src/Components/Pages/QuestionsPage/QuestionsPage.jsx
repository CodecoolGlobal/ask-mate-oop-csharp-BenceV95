import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';
import SearchDiv from "./SearchDiv";
import QuestionCard from "../../QuestionCard/QuestionCard";
import { use } from "react";

export default function QuestionsPage({ questions, categories, setQuestions }) {

    const { user } = useContext(AuthContext)
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchResult, setSearchResult] = useState([]);



    useEffect(() => {
        if (selectedCategory === 0 && searchResult.length === 0) {
            setFilteredQuestions(questions)
        } else {
            //const filteredByTag = filterQuestionsByTag(selectedCategory);            
            //setFilteredQuestions(filteredByTag)
            setFilteredQuestions(searchResult);
            console.log("search updated");

        }
    }, [questions, selectedCategory, searchResult]);

    const fetchQuestions = async (query) => {

        try {
            const response = await fetch(`http://localhost:5166/Question/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setSearchResult(data);
                console.log("search data: ", data);

            }
        } catch (error) {
            console.log("fetch failed:", error);
        }
    }



    const filterQuestionsByTag = (id) => {
        if (id === 0) {
            return questions;
        }
        const filtered = questions.filter((question) => question.categories === id);
        console.log(filtered);
        return filtered;
    }
    /* 
    The plan is to use media query breakpoints
    so that the website looks appealing and has great ratios
    for all screens. ask a mentor for help.
    */
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
                        {filteredQuestions.length > 0 ? filteredQuestions.map(question => {
                            return <QuestionCard withButtons={true} user={user} categories={categories} question={question}></QuestionCard>
                        }) : "No Question in this category yet!"}
                    </div>

                    <div className="askAQuestionDiv">
                        <a className="btn btn-warning" href="/ask">Ask a Question</a>
                        <SearchDiv onSearch={fetchQuestions} />
                    </div>
                </div>
                :
                <Navigate to={"/error"} />
            }
        </>
    )
}