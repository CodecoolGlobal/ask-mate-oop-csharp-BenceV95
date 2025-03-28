import "./Profile.css";
import React from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user } = React.useContext(AuthContext);

  return (
    <>
    {user ? (

    
      <div className="user-profile-main">
        <h4>
          Dear user,
          <br />
          On this page you can edit your data, but in the future this
          functionality might be extended!
        </h4>
        <form action="">
          <div className="inputFieldsDiv">
            <div className="usernameDiv">
              <label htmlFor="name">Username:</label>
              <input
                type="text"
                placeholder={user.username}
                name="name"
                id="name"
              />
            </div>
            <div className="emailDiv">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder={user.email}
                name="email"
                id="email"
              />
            </div>
            <div className="newPwDiv">
              <label htmlFor="newpw">New Password</label>
              <input type="text" name="newpw" id="newpw" />
            </div>
          </div>
          <button className="btn btn-success" type="submit">
            Save
          </button>
          <button className="btn btn-danger">Delete Account</button>
        </form>
      </div>
      )
    :
    (
        <Navigate to={"/unauthorized"} />
    )}
    </>
  );
}
