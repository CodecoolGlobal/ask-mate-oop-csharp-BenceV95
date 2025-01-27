import React, { useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import SearchUser from "./SearchUser"
import PaginatedUsers from "./PaginatedUsers"
import UserCard from "./UserCard"


export default function UsersPage() {
    const { user } = React.useContext(AuthContext)
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <>
            {user.isAdmin ?
                <><SearchUser setSelectedUser={setSelectedUser} />
                    {selectedUser === null ? <PaginatedUsers /> : <UserCard user={selectedUser}/>}
                </> : <Navigate to={"/error"} />}
        </>
    )
}