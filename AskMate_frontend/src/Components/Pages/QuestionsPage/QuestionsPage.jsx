import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate, Link } from "react-router-dom"
import Tags from "./Tags"
import './QuestionsPage.css';
import SearchDiv from "./SearchDiv";
import QuestionCard from "../../QuestionCard/QuestionCard";
import { use } from "react";

export default function QuestionsPage({ questions, categories, setQuestions }) {

    const { user } = useContext(AuthContext)

    const [searchResult, setSearchResult] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);


    useEffect(() => {

        if (selectedCategory === 0 && searchResult.length === 0) {
            //setFilteredQuestions(questions)
            console.log("no category, search");
            
        } else {            
            console.log("search updated ", selectedCategory);
        }

    }, [questions, selectedCategory, searchResult]);

    const fetchQuestions = async (query) => {

        try {
            const response = await fetch(`/api/Question/search?query=${encodeURIComponent(query)}`, {
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

    return (
        <>
            {user.isLoggedIn ?
                <div className="mainDiv">

                    <div className="categoriesDiv">
                        <Tags
                            categories={categories}
                            selector={setSelectedCategory}                            
                        />
                    </div>
                    <div className="questionsDiv">
                        {questions.map((question,i) => {
                            return <QuestionCard
                                key={i} // so it stops complaining even though it is set under the component...
                                user={user}
                                categories={categories}
                                question={question}
                            />
                        })}
                    </div>

                    <div className="askAQuestionDiv">
                        <Link className="btn btn-warning" to="/ask">Ask a Question</Link>
                        <SearchDiv onSearch={fetchQuestions} />
                    </div>
                </div>
                :
                <Navigate to={"/error"} />
            }
        </>
    )
}