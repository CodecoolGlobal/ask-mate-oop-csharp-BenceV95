//import "./Profile.css";
import React, { useState } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { apiDelete, apiPost, apiPut } from "../../../utils/api";

export default function Profile() {
  const { user, setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: user?.username,
    email: user?.email,
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {

      const updateData = formData;

      const response = await apiPut(`user/update/${user.id}`, updateData);
      alert("Profile updated successfully!");
      setUser({...user, username : updateData.username, email : updateData.email})
      window.location.reload(true);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile: " + error.message);
    }
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
        <div className="border border-2 p-3 rounded w-50">
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
                onChange={handleInputChange}
                value={formData.username}
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
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newpw">New Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="New Password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </div>
            <div className="mt-3 mb-3 d-flex flex-column gap-3">
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
