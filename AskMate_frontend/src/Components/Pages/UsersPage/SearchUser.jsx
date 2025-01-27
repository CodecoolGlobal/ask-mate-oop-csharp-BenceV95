import { useEffect, useState } from "react";
import "./SearchUser.css"


export default function SearchUser({ setSelectedUser }) {

    const [searchValue, setSearchValue] = useState("");



    async function fetchUser(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:5166/User?nameOrEmail=${searchValue}`)
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


