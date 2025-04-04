import "./SearchDiv.css";
import { useState } from "react";

export default function SearchDiv({ onSearch }) {

    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form className="searchDiv" onSubmit={handleSubmit}>
            <p>Search In Questions</p>
            <br />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                required
            />
            <button className="btn btn-success m-1" type="submit">Search</button>
        </form>
    )
}