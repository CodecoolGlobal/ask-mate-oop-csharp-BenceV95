import React from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"


export default function UsersPage({ users }) {
    const { user } = React.useContext(AuthContext)

    return (
        <>
            {user.isLoggedIn ?
                <>
                    {users.map(user => {
                        return <div key={user.id} class="card" style={{ width: `${24}rem` }}>
                            <div class="card-body">
                                <h5 class="card-title">Username: {user.username}</h5>
                                <p class="card-text">Email: {user.email}</p>
                                <a href="#" class="btn btn-primary">Select</a>
                            </div>
                        </div>
                    })}
                </> : <Navigate to={"/error"} />}
        </>
    )
}