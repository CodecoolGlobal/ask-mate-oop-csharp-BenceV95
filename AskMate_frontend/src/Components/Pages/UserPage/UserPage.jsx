import { useParams } from "react-router-dom";
import "./UserPage.css"
import { useContext, useEffect, useState } from "react";
import QuestionCard from "../../QuestionCard/QuestionCard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AnswerCard from "../../AnswerCard/AnswerCard";
import React from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { apiGet } from "../../../utils/api";



// user can view their own profile/questions/answers
// CRUD actions on their own content
// display the ratio of ALL your answers being useful/unuseful



//todo: 
// - fix the setAnswers (on mount the answers are not loaded)
// - think abou where to set a delete button both on questions and answers (on the list, or on the dedicated page?)


export default function UserPage({ users, categories, questions }) {
    const [answers, setAnswers] = useState(null);
    const { user } = React.useContext(AuthContext)

    const [selectedUser, setSelectedUser] = useState({});

    function findUser(username) {
        const user = users.find((user) => user.username === username);
        return user ? user : {} //kinda weird: users takes some to load i guess, so when i try to find the right user, it gives back undefined, so i have to return something else it throws an error. But if i return an empty object, it works just fine
    }


    useEffect(() => {
        setSelectedUser(findUser(user.username))
    }, [users])


    //find out why answers dont load properly! 
    useEffect(() => {
        getAllUserAnswers().then(answers => setAnswers(answers));
    }, [questions])



    // for now it will filter on the frontend 



    //TODO: finish the design! (the labels should start at the same "line", also the input fields should be the same size, start and end at the same width)

    //on the backend there is  a method to delete users, but if the user posted questions, answers then he/she cannot be deleted! fix this: if u delete an user, the question/answer should remain, but be marked as post by: "deleted user" or something



    function selectUsersQuestions(questions) {
        return questions?.filter(question => question.userId === selectedUser.id);
    }


    async function getAllUserAnswers() {
        try {
            const userQuestions = selectUsersQuestions(questions);

            const responses = await Promise.all(
                userQuestions.map(async (question) => {
                    const data = await apiGet(`/Answer/all/${question.id}`);

                    return data;
                })
            );

            return responses.flat();

        } catch (e) {

            console.log(e)
        }
    }



    return (
        <div className="userPageMainDiv">
            <form action="">
                <div className="inputFieldsDiv">
                    <div className="usernameDiv">
                        <label htmlFor="name">Username:</label>
                        <input type="text" placeholder={user.username} name="name" id="name" />
                    </div>
                    <div className="emailDiv">
                        <label htmlFor="email">Email:</label>
                        <input type="email" placeholder={selectedUser.email} name="email" id="email" />
                    </div>
                </div>
                <button type="submit">Save</button>
                <button>Delete</button>
            </form>
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

        </div>
    )

}