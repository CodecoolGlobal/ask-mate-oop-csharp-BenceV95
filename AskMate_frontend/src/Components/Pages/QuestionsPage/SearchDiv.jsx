//import "./SearchDiv.css";
import { useState } from "react";

export default function SearchDiv({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query,0,10);
      console.log("query", query);
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          required
          className="form-control"
        />
        <button className="btn btn-success" type="submit">
          Search
        </button>
        <button className="btn btn-danger" type="button" onClick={() => onSearch("",0,100)}>
          Reset
        </button>
      </div>
    </form>
  );
}
