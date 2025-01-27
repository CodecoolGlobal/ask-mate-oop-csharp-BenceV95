import React from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"
import SearchUser from "./SearchUser"
import PaginatedUsers from "./PaginatedUsers"


export default function UsersPage({ users }) {
    const { user } = React.useContext(AuthContext)

    return (
        <>
            {user.isAdmin ?
                <><SearchUser />
                    <PaginatedUsers users={users}/>
                </> : <Navigate to={"/error"} />}
        </>
    )
}