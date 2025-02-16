import { useParams } from "react-router-dom";
import "./UserPage.css"
import { useEffect, useState } from "react";
import QuestionCard from "../../QuestionCard/QuestionCard";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



// user can view their own profile/questions/answers
// CRUD actions on their own content
// display the ratio of ALL your answers being useful/unuseful


export default function UserPage({ users, categories }) {
    const { username } = useParams();
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState(null);

    const [selectedUser, setSelectedUser] = useState({});

    function findUser(username) {
        const user = users.find((user) => user.username === username);
        return user ? user : {} //kinda weird: users takes some to load i guess, so when i try to find the right user, it gives back undefined, so i have to return something else it throws an error. But if i return an empty object, it works just fine
    }


    useEffect(() => {
        setSelectedUser(findUser(username))
        fetchQuestions()
    }, [users])

    useEffect(() => {
        console.log("questions", questions)
    }, [])

    // for now it will filter on the frontend
    async function fetchQuestions() {
        try {
            const response = await fetch("http://localhost:5166/Question", {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Error fetching questions!");
            }
            const data = await response.json();
            setQuestions(data);
        } catch (e) {
            console.log(e.message)
        }
    }

    async function fetchAnswers() {
        try {

        } catch (e) {

        }
    }


    //TODO: finish the design! (the labels should start at the same "line", also the input fields should be the same size, start and end at the same width)

    //on the backend there is  a method to delete users, but if the user posted questions, answers then he/she cannot be deleted! fix this: if u delete an user, the question/answer should remain, but be marked as post by: "deleted user" or something

    //fix the checkbox so it is controlled via states

    console.log("selectedUser:", selectedUser)

    console.log("isTrue:", selectedUser.role === "admin")


    function selectUsersQuestions(questions) {
        return questions?.filter(question => question.userId === selectedUser.id);
    }



    return (
        <div className="userPageMainDiv">
            {username}
            <form action="">
                <div className="inputFieldsDiv">
                    <div className="usernameDiv">
                        <label htmlFor="name">Username:</label>
                        <input type="text" placeholder={username} name="name" id="name" />
                    </div>
                    <div className="emailDiv">
                        <label htmlFor="email">Email:</label>
                        <input type="email" placeholder={selectedUser.email} name="email" id="email" />
                    </div>
                </div>
                <button type="submit">Save</button>
                <button>Delete</button>
            </form>
            <div className="user-questions dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </button>
                <ul class="dropdown-menu">
                    {selectUsersQuestions(questions)?.map((question, index) =>
                        <li key={index} ><a class="dropdown-item" >  <QuestionCard user={selectedUser} categories={categories} question={question} /></a></li>

                    )}
                </ul>
            </div>
        </div>
    )

}