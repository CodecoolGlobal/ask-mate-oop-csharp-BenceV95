import { useEffect, useState } from "react";
import "./SearchUser.css"
import { apiGet } from "../../../utils/api";


export default function SearchUser({ setSelectedUser }) {

    const [searchValue, setSearchValue] = useState("");



    async function fetchUser(e) {
        e.preventDefault();
        const response = await apiGet(`/User?nameOrEmail=${searchValue}`)
        const data = await response.json();
        setSelectedUser(data);

    }


    return (
        <div className="searchUserDiv">
            <form onSubmit={fetchUser} action="">
                <input onChange={(e) => setSearchValue(e.target.value)} placeholder="Username/Email" type="text" name="" id="" />
                <button type="submit">Search</button>

            </form>

        </div>
    )
}


