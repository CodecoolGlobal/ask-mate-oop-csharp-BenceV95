import { useState } from "react"
import "./UserCard.css"
import { apiDelete, apiPut } from "../../../utils/api";



export default function UserCard({ user }) {

    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState(user.username);
    const [newEmail, setNewEmail] = useState(user.email);

    function editUser() {
        setEditMode(true);
    }

    function saveChanges(e) {
        e.preventDefault();
        submitChanges();
        setEditMode(false);
    }

    //users are deleted/updated in the db but the changes are not being rendered!


    async function deleteUser() {
        try {
            const response = await apiDelete(`/users/${user.id}`);
            alert("user deleted!") //temporary display

        } catch (e) {
            console.log(e)
        }
    }


    async function submitChanges() {
        try {
            const response = await apiPut(`/User/update/${user.id}`, {
                username: newName,
                email: newEmail
            });

        } catch (e) {

            console.error("Error updating user:", e);
        }


    }



    return (
        editMode ? <div>
            <form action="">
                <input onChange={(e) => setNewName(e.target.value)} placeholder={user.username} type="text" name="" id="" /><br />
                <input onChange={(e) => setNewEmail(e.target.value)} placeholder={user.email} type="email" />
                <button type="submit" onClick={saveChanges} className="btn btn-success" >Save</button>
            </form>
            <button onClick={deleteUser} className="btn btn-danger" >Delete</button>
        </div> :


            <div className="userCardMainDiv">
                {user.username}<br />
                {user.email}
                <button onClick={editUser} className="btn btn-warning" >Edit</button>
            </div>
    )
}


