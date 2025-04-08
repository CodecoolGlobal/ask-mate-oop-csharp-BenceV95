import './AskQuestionForm.css';
import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../../utils/api";

const AskQuestionForm = ({ categories }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ask question second
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // search first
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    if (searchQuery.trim()) {
      setTitle(searchQuery);
      fetchQuestions(searchQuery);
    }
  };

  const fetchQuestions = async (query) => {
    try {
      const data = await apiGet(
        `Question/search?query=${encodeURIComponent(query)}`
      );
      setSearchResult(data);
    } catch (error) {
      console.log("fetch failed:", error);
    }
  };

  async function SubmitQuestion(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCategory === 0) {
        throw new Error("Category must be set!");
      }
      if (title.trim() == "" || body.trim() == "") {
        throw new Error("Title and Body must have content !");
      }

      const data = await apiPost("Question", {
        id: "", // modify backend so it doesnt expect unnecesary data (id, userdId etc...)
        userId: "",
        title: title,
        body: body,
        categories: selectedCategory,
      });
      setLoading(false);
      navigate(`/questions/${data.message}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setResponseMessage(error.message);
    }
  }

  return (
    <>
      {user ? (
        <div className="d-flex flex-column gap-3 searchDiv">
          {!searching ? (
            <>
              <form
                onSubmit={handleSubmit}
                className="searchInputDiv border border-2 border-white rounded p-3 d-flex flex-column gap-3"
              >
                <textarea
                  className="form-control"
                  placeholder='Ask a question. For best results, start with a question word like "How" or "What".'
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  name="search"
                  required
                  disabled={searching}
                  style={{ minHeight: "100px" }}
                />
                <div className="d-flex justify-content-around">
                  {searching ? (
                    <button className="btn btn-success" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      <span role="status">Loading...</span>
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success">
                      Search
                    </button>
                  )}

                  {searched && (
                    <button
                      onClick={() => setSearching(true)}
                      className="btn btn-primary"
                    >
                      Ask
                    </button>
                  )}
                </div>
              </form>

              {searched && (
                <div className="d-flex flex-column border border-2 border-white rounded p-3 gap-3 searchResults">
                  <h3>Search Results</h3>
                  {searchResult.length === 0 ? (
                    <div>
                      <p>
                        Seems like you have a unique question which has not been
                        asked until now!
                      </p>
                    </div>
                  ) : (
                    searchResult.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 rounded"
                        style={{ backgroundColor: "#404040" }}
                      >
                        <h3>{result.title}</h3>
                        <p>{result.body}</p>
                        <Link
                          to={`/questions/${result.id}`}
                          className="btn btn-primary"
                        >
                          View Question
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="border border-2 border-white rounded p-3">
              <form className="ask" onSubmit={SubmitQuestion}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    className="form-control"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="body" className="form-label">
                    Details
                  </label>
                  <textarea
                    placeholder="You can go in depth here, be specific. The more details you provide, the better the answers you will get."
                    name="body"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    required
                    className="form-control"
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="categories" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select form-select-sm"
                    name="categories"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value={0} disabled>
                      Set category
                    </option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      <span role="status">Loading...</span>
                    </>
                  ) : (
                    <>Ask</>
                  )}
                </button>
              </form>
              {responseMessage && (
                <div className="mt-5">
                  <p style={{ color: "#dc3545", fontSize: "2rem" }}>
                    {responseMessage}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Navigate to={"/unauthorized"} />
      )}
    </>
  );
};

export default AskQuestionForm;
