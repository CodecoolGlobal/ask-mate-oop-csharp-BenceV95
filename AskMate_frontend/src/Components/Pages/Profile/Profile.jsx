import "./Profile.css"
import React from "react"
import { AuthContext } from "../../AuthContext/AuthContext"

export default function Profile() {
    const { user } = React.useContext(AuthContext)



    function findUser(username) {
        const user = users.find((user) => user.username === username);
        return user ? user : {}
    }


    useEffect(() => { 
        setSelectedUser(findUser(user.username))
    }, [users])


    return (
        <div className="user-profile-main">
            <h4>Dear user,
                <br />
                On this page you can edit your data, but in the future this functionality might be extended!
            </h4>
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
        </div>
    )
}