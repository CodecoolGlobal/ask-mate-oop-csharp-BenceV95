//import "./Profile.css";
import React from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { apiDelete, apiPost } from "../../../utils/api";

export default function Profile() {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("WIP");
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      const del = await apiDelete(`users/${user.id}`);      
      await apiPost("user/logout", {});
      alert(del.message);
      navigate("/", { replace: true });
      window.location.reload(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user ? (
        <div className="border border-2 p-3 rounded">
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                placeholder={user.username}
                name="username"
                id="username"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder={user.email}
                name="email"
                id="email"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newpw">New Password</label>
              <input
                type="password"
                name="newpw"
                id="newpw"
                className="form-control"
                placeholder="new password"
              />
            </div>
            <div className="mb-3 d-flex flex-column gap-3">
              <button
                className="btn btn-success"
                type="submit"
                onClick={(e) => handleUpdate(e)}
              >
                Save
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => handleDelete(e)}
                type="button"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Navigate to={"/unauthorized"} />
      )}
    </>
  );
}
