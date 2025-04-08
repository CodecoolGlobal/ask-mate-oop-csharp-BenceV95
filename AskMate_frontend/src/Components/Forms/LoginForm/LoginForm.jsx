import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./LoginForm.css";
import { apiPost } from "../../../utils/api";
import { AuthContext } from "../../AuthContext/AuthContext";

export default function LoginForm({ navigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, loginContext } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiPost("User/login", { username, password });
      loginContext(response);
      setResponse("Succesfully logged in !");
    } catch (error) {
      setResponse(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      {user ? (
        <div>
          <h1>
            You are already logged in as {user.username} !
            <br />
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
          </h1>
        </div>
      ) : (
        <div className="custom-container border border-white rounded p-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email address / Username
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email"
                required
                minLength={3}
                disabled={loading || user}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Password" className="form-label">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="form-control"
                required
                minLength={6}
                maxLength={24}
                disabled={loading || user}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || user}
            >
              {
                <>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      <span role="status">Logging in...</span>
                    </>
                  ) : (
                    <>Login</>
                  )}
                </>
              }
            </button>
          </form>
          <div className="container mt-3">
            <p style={user ? { color: "green" } : { color: "red" }}>
              {response}
            </p>
          </div>
          <div className="container mt-5">
            <Link to="/register" className="btn btn-primary">
              Don't have an account?
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
