import { useState } from "react"
import "./UserCard.css"



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
        const response = await fetch(`http://localhost:5166/users/${user.id}`, {
            method: "DELETE",
            credentials: "include"
        });
        alert("user deleted!") //temporary display
    }


    async function submitChanges() {
        const response = await fetch(`http://localhost:5166/User/update/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: newName,
                email: newEmail
            })
        });

        if (response.ok) {
            console.log("User updated successfully:");
        } else {
            console.error("Error updating user:", response.statusText);
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


