import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/UnauthorizedPage";
import "./AnswerPage.css";
import { AuthContext } from '../../AuthContext/AuthContext';

const AnswerPage = ({ fetchData, categories, users }) => {
    const { user } = useContext(AuthContext);

    const { id } = useParams(); // Destructure the `id` from the URL
    const [questionData, setQuestionData] = useState(null);
    const [answerBody, setAnswerBody] = useState("");
    const [answers, setAnswers] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await fetchData(`http://localhost:5166/Question/${id}`)
                setQuestionData(data);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchAnswers = async () => {
            try {
                const data = await fetchData(`http://localhost:5166/Answer/all/${id}`)
                setAnswers(data.reverse());
            } catch (error) {
                console.log(error);
            }
        }
        fetchAnswers();
        fetchQuestion();
    }, [id, fetchAgain])

    const findCategoryNameById = (id) => {
        const result = categories.find(category => category.id == id);
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

    async function handleSubmit(e) {
        e.preventDefault();

        if (answerBody === "") {
            alert("Please write an non empty answer!")
            return;
        }

        await postAnswer()
        setFetchAgain(!fetchAgain)
        setAnswerBody("");
    }

    function convertDate(dateString) {
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return (`${formattedDate} ${formattedTime}`);
    }

    function getUsernameById(id) {
        const user = users.find((user) => user.id === id);
        return user ? user.username : "Anonym";
    }

    return (
        <>
            {questionData != null ?
                <div className="mainAnswerDiv">

                    <div className="questionDetailsDiv">
                        <h1>{questionData.title}</h1>
                        <h3>{questionData.body}</h3>
                        <h4>Category: {findCategoryNameById(questionData.categories)}</h4>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)} className="answerForm">
                        <textarea
                            value={answerBody}
                            name="answerBody"
                            className="answerBody"
                            id="answerBody"
                            placeholder="Your answer"
                            onChange={(e) => { setAnswerBody(e.target.value) }}
                        ></textarea>
                        <button className='btn btn-success' type="submit">Send Answer</button>
                    </form>

                    <div className="answersDiv">
                        {answers.map(answer => {
                            return (<div key={answer.id} className="answerCardDiv" >
                                <div className="answerCardHeader">
                                    <p>{getUsernameById(answer.userId)}'s answer:</p>
                                    <i>{convertDate(answer.postDate)}</i>
                                    {answer.userId === user.id &&
                                        (<>
                                            <button className="btn btn-danger">Delete</button>
                                            <button className="btn btn-warning">Edit (WIP)</button>
                                        </>)}

                                </div>
                                <pre>{answer.body}</pre>
                            </div>)
                        })}
                    </div>

                </div>
                :
                <ErrorPage />
            }
        </>
    );
};

export default AnswerPage;
