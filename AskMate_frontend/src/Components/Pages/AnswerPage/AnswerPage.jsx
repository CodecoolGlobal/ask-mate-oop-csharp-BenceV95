import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Missing from "../ErrorPage/Missing";
import "./AnswerPage.css";
import { AuthContext } from "../../AuthContext/AuthContext";
import Answers from "./Answers";
import { apiGet, apiPost, apiDelete } from "../../../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";

const AnswerPage = ({ categories }) => {
  const { user } = useContext(AuthContext);
  let navigate = useNavigate();
  const { id } = useParams(); // Destructure the `id` from the URL
  const [questionData, setQuestionData] = useState(null);
  const [answerBody, setAnswerBody] = useState("");
  const [answers, setAnswers] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isQuestionClosed, setIsQuestionClosed] = useState(false);
  const [isQuestionDeleting, setIsQuestionDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
  
      try {
        // 1. Fetch question
        const question = await apiGet(`/Question/${id}`);
        setQuestionData(question);
  
        // 2. Fetch answers
        const answersData = await apiGet(`/Answer/all/${id}`);
        if (answersData.some((a) => a.isAccepted === true)) {
          setIsQuestionClosed(true);
        }
  
        const reversedAnswers = answersData.reverse();
        setAnswers(reversedAnswers);
  
        // 3. Fetch usernames for each answer.userId
        const usernamesData = await Promise.all([
          ...reversedAnswers.map((answer) =>
            apiGet(`User/GetUserByNameOrEmail?nameOrEmail=${answer.userId}`)
          ),apiGet(`User/GetUserByNameOrEmail?nameOrEmail=${question.userId}`)
        ]);
        console.log(usernamesData);
        
        setUsernames(usernamesData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllData();
  }, [id, fetchAgain]);
  

  const findCategoryNameById = (id) => {
    const result = categories.find((category) => category.id == id);
    return result ? result.name : "uncategorized";
  };

  async function postAnswer() {
    try {
      const r = await apiPost("/Answer", {
        id: "",
        userId: "",
        questionID: id,
        body: answerBody,
        isAccepted: false,
      });
      console.log(`New answers's ID: ${r.message}`);
    } catch (error) {
      alert(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (answerBody.trim() === "") {
      alert("Please write an non empty answer!");
      return;
    }

    await postAnswer();
    setFetchAgain(!fetchAgain);
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
    return `${formattedDate} ${formattedTime}`;
  }

  function getUsernameById(id) {
    const usern = usernames.find((user) => user.id == id);
    return usern?.username ?? "Anonym";
  }

  const deleteQuestion = async (id) => {
    setIsQuestionDeleting(true);

    try {
      // is this supposed to delete all answers for a single question, as it doesnt do this currently
      const response = await fetch(`/api/Answer/all/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const response = await fetch(`/api/Question/${id}`, {
          method: "DELETE",
          credentials: "include",
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
  };

  const deleteAnswer = async (id) => {
    try {
        const del = await apiDelete(`/Answer/${id}`);        
        alert(del.message);
        setFetchAgain(!fetchAgain);
    } catch (error) {
        alert(error);
    }
  }

  return (
    <>
      {isLoading ? (<LoadingPage />) :
      questionData != null ? (
        <div className="mainAnswerDiv">
          {questionData.userId === user.id && (
            <div className="container border border-2 border-white rounded p-2">
              <h1>Question Actions</h1>
              <div className="d-flex gap-2 flex-row justify-content-around">
                <button
                  className="btn btn-warning"
                  onClick={() => alert("Not implemented yet")}
                >
                  Edit Question
                </button>
                {isQuestionDeleting ? (
                  <button className="btn btn-danger" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Deleting...</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    id={questionData.id}
                    onClick={(e) => deleteQuestion(e.target.id)}
                  >
                    Delete Question
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="border border-2 border-white rounded p-3">
            <div className="d-flex justify-content-between border-2 border-white border-bottom">
              <span>👑 {getUsernameById(questionData.userId)}'s Question</span>
              <span>
                Category: {findCategoryNameById(questionData.categories)}
              </span>
            </div>
            {isQuestionClosed && (
              <h1 style={{ color: "#28a745" }}>[Question Closed]</h1>
            )}
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
              placeholder={
                isQuestionClosed
                  ? "This questions is closed, you can no longer answer"
                  : "Your answer"
              }
              disabled={isQuestionClosed}
              onChange={(e) => {
                setAnswerBody(e.target.value);
              }}
            ></textarea>
            <button
              className="btn btn-success"
              type="submit"
              disabled={isQuestionClosed}
            >
              Send Answer
            </button>
          </form>
          <Answers
            answers={answers}
            getUsernameById={getUsernameById}
            convertDate={convertDate}
            user={user}
            op_id={questionData.userId}
            isQuestionClosed={isQuestionClosed}
            deleteAnswer={deleteAnswer}
          />
        </div>
      ) : (
        <Missing />
      )}
    </>
  );
};

export default AnswerPage;
