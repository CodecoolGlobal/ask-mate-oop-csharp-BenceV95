import { useParams } from "react-router-dom";
import "./UserPage.css"
import { useEffect, useState } from "react";



export default function UserPage({ users }) {
    const { username } = useParams();

    const [selectedUser, setSelectedUser] = useState({});

    function findUser(username) {
        const user = users.find((user) => user.username === username);
        return user ? user : {} //kinda weird: users takes some to load i guess, so when i try to find the right user, it gives back undefined, so i have to return something else it throws an error. But if i return an empty object, it works just fine
    }


    useEffect(() => {
        setSelectedUser(findUser(username))
    }, [users])




    //TODO: finish the design! (the labels should start at the same "line", also the input fields should be the same size, start and end at the same width)

    //on the backend there is  a method to delete users, but if the user posted questions, answers then he/she cannot be deleted! fix this: if u delete an user, the question/answer should remain, but be marked as post by: "deleted user" or something

//fix the checkbox so it is controlled via states

console.log("selectedUser:", selectedUser)

console.log("isTrue:", selectedUser.role === "admin")


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
                    <div className="isAdminDiv">
                        <label htmlFor="isAdmin">Admin?:</label>
                        <input checked={selectedUser.role === "admin"} type="checkbox" name="isAdmin" id="isAdmin" />
                    </div>
                </div>
                <button type="submit">Save</button>
                <button>Delete</button>
            </form>
        </div>
    )

}