import { useParams } from "react-router-dom";
import "./UserPage.css"
import { useContext, useEffect, useState } from "react";
import QuestionCard from "../../QuestionCard/QuestionCard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AnswerCard from "../../AnswerCard/AnswerCard";
import React from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { apiGet, apiPost } from "../../../utils/api";
import RatioBar from "../AnswerPage/RatioBar";
import { Link, Navigate } from "react-router-dom";



// user can view their own profile/questions/answers
// CRUD actions on their own content
// display the ratio of ALL your answers being useful/unuseful


//get all the users answers
//get all the votes that are on the answers


//todo: 
// - fix the setAnswers (on mount the answers are not loaded)
// - think abou where to set a delete button both on questions and answers (on the list, or on the dedicated page?)


export default function UserPage({ categories, questions }) {
    const [answers, setAnswers] = useState(null);
    const { user } = React.useContext(AuthContext)
    
    const [userVotes, setUserVotes] = useState(null);

 
    useEffect(() => {
        if(user)
        {
            getAllUserAnswers().then(answers => setAnswers(answers));
        }
    }, [user]) 

    async function getAllUserAnswers() {
        try {
            const data = await apiGet(`/Answer/all/byUserId/${selectedUser.id}`);

            return data;

        } catch (e) {

            console.log(e) 
        }
    }


    async function getUsersVotes() {
        const answerIds = answers?.map(answer => answer.id)
        const userVotes = await apiPost("votes", {AnswerIds : answerIds});
        return userVotes;
    }

    useEffect(() => {
        if(answers)
        {
            getUsersVotes().then(votes => setUserVotes(votes));
        }
    }, [answers])


    return (
        <>
        {user?.role == "admin" ? (
            <div className="userPageMainDiv">
            <Link to={"/profile"}>
            <button className="btn btn-warning">Edit Profile</button>
            </Link>
            <div className="questions-and-answers">
                <div className="user-questions dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Users Questions
                    </button>
                    <ul className="dropdown-menu">
                        {selectUsersQuestions(questions)?.map((question, index) =>
                            <li key={index} ><a className="dropdown-item" href={`http://localhost:5173/questions/${question.id}`} >  <QuestionCard withButtons={false} user={selectedUser} categories={categories} question={question} /></a></li>

                        )}
                    </ul>

                </div>
                <div className="user-answers dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Users Answers
                    </button>
                    <ul className="dropdown-menu">
                        {answers?.map((answer, index) =>
                            <li key={index} ><a className="dropdown-item" href={`http://localhost:5173/questions/${answer.questionID}`}  >  <AnswerCard user={selectedUser} categories={categories} answer={answer} /></a></li>

                        )}
                    </ul>

                </div>
            </div>
                    {userVotes && <RatioBar voteData={userVotes} displayNumberOfVotes={true} /> }        
        </div>
        ) : (
            <Navigate to={"/unauthorized"} />
        )}
        
        
        </>
    )

}