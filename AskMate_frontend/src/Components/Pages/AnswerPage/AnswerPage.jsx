import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/UnauthorizedPage";

const AnswerPage = ({ fetchData, categories }) => {
    const { id } = useParams(); // Destructure the `id` from the URL
    const [questionData, setQuestionData] = useState(null);
    const [answerBody, setAnswerBody] = useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await fetchData(`http://localhost:5166/Question/${id}`)
                setQuestionData(data);
                console.log(data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchQuestion();
    }, [id])

    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
        console.log("categories:", categories)
        return !result ? "not found" : result.name //for some reason, this solved the problem with category name not being displayed, but unsure why
    }

    async function postAnswer() {
        try {
            const response = await fetch("http://localhost:5166/Answer", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    id: "",
                    userId: "",
                    questionID: id,
                    body: answerBody,
                    isAccepted: false
                }),
                credentials: "include"
            })
            // const result = await response.json(); response is not the right format, check the backend!
            if (response.ok) {
                console.log("answer sent")
            } else {
                console.log("error during sending answer")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        postAnswer()
    }


    return (
        <div>
            {questionData != null ?
                <div className="main">
                    <div className="questionDetailsDiv">
                        <h1>{questionData.title}</h1>
                        <h3>{questionData.body}</h3>
                        <h4>Category: {findCategoryNameById(questionData.categories)}</h4>
                    </div>
                    <div className="answerDiv">
                        <form onSubmit={(e) => handleSubmit(e)} action="">
                            <textarea name="answerBody" id="answerBody" placeholder="Your answer" onChange={(e) => { setAnswerBody(e.target.value) }} ></textarea>
                            <button type="submit">Send Answer</button>
                        </form>
                    </div>
                </div>

                :
                <ErrorPage />
            }
        </div>
    );
};

export default AnswerPage;
