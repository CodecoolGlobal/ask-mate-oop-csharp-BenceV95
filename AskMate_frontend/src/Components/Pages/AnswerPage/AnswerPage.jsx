import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/UnauthorizedPage";
import "./AnswerPage.css";
import { AuthContext } from '../../AuthContext/AuthContext';
import Answers from "./Answers";
import { apiGet, apiPost, apiDelete } from "../../../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AnswerPage = ({ categories }) => {
    const { user } = useContext(AuthContext);
    let navigate = useNavigate();
    const { id } = useParams(); // Destructure the `id` from the URL
    const [questionData, setQuestionData] = useState(null);
    const [answerBody, setAnswerBody] = useState("");
    const [answers, setAnswers] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [isQuestionClosed, setIsQuestionClosed] = useState(false);
    const [isQuestionDeleting, setIsQuestionDeleting] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await apiGet(`/Question/${id}`)
                setQuestionData(data);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchAnswers = async () => {
            try {
                const data = await apiGet(`/Answer/all/${id}`);

                if (data.some(a => a.isAccepted == true)) {
                    setIsQuestionClosed(true);
                }
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
        return result ? result.name : "uncategorized";
    }

    async function postAnswer() {
        try {
            const r = await apiPost("/Answer", {
                id: "",
                userId: "",
                questionID: id,
                body: answerBody,
                isAccepted: false
            });
            console.log(`New answers's ID: ${r.message}`);

        } catch (error) {
            alert(error);
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

        const formattedDate = date.toLocaleDateString({
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString({
            hour: "2-digit",
            minute: "2-digit",
        });
        return (`${formattedDate} ${formattedTime}`);
    }

    function getUsernameById(id) {
        return "Anonym";
    }

    const deleteQuestion = async (id) => {
        setIsQuestionDeleting(true);

        try {
            // is this supposed to delete all answers for a single question, as it doesnt do this currently
            const response = await fetch(`/api/Answer/all/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });

            if (response.ok) {

                const response = await fetch(`/api/Question/${id}`, {
                    method: 'DELETE',
                    credentials: "include"
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok!");
                }

            }

            setIsQuestionDeleting(false);
            alert("Question deleted successfully");
            navigate("/", { replace: true, forceRefresh: true });
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            {questionData != null ?
                <div className="mainAnswerDiv">
                    {
                        questionData.userId === user.id && (
                            <div className="container border border-2 border-white rounded p-2">
                                <h1>Question Actions</h1>
                                <div className="d-flex gap-2 flex-row justify-content-around">
                                    <button className="btn btn-warning" onClick={() => alert("Not implemented yet")}>Edit Question</button>
                                    {isQuestionDeleting ?
                                        (<button className="btn btn-danger" disabled>
                                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            <span role="status">Loading...</span>
                                        </button>)
                                        :
                                        <button
                                            className="btn btn-danger"
                                            id={questionData.id}
                                            onClick={(e) => deleteQuestion(e.target.id)}
                                        >Delete Question</button>
                                    }
                                </div>
                            </div>
                        )
                    }


                    <div className="container border border-2 border-white rounded">

                        <div className="d-flex justify-content-between border-2 border-white border-bottom">
                            <span>👑 {getUsernameById(questionData.userId)}'s Question</span>
                            <span>Category: {findCategoryNameById(questionData.categories)}</span>
                        </div>
                        {isQuestionClosed && (<h1 style={{ color: "#28a745" }}>[Question Closed]</h1>)}
                        <h1>{questionData.title}</h1>
                        <p>{questionData.body}</p>
                        <div className="d-flex justify-content-between border-2 border-white border-top">
                            <span>{convertDate(questionData.postDate)}</span>
                            <span>Answers: {answers.length}</span>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e)} className="answerForm">
                        <textarea
                            value={answerBody}
                            name="answerBody"
                            className="answerBody"
                            id="answerBody"
                            placeholder={isQuestionClosed ? ("This questions is closed, you can no longer answer") : ("Your answer")}
                            disabled={isQuestionClosed}
                            onChange={(e) => { setAnswerBody(e.target.value) }}
                        ></textarea>
                        <button className='btn btn-success' type="submit" disabled={isQuestionClosed}>Send Answer</button>
                    </form>
                    <Answers answers={answers}
                        getUsernameById={getUsernameById}
                        convertDate={convertDate}
                        user={user}
                        op_id={questionData.userId}
                        isQuestionClosed={isQuestionClosed}
                    />
                </div>
                :
                <ErrorPage />
            }
        </>
    );
};

export default AnswerPage;
