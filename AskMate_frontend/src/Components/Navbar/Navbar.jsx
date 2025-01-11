import LoginForm from "../Forms/LoginForm/LoginForm";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import React from "react";
import { Button } from "bootstrap";

const Navbar = ({ handleLogOut }) => {

  const { user } = React.useContext(AuthContext)


  console.log("inNavbar", user)

  return (
    <>
      <nav className="navbar mb-5 navbar-expand-sm bg-primary text-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">AskApe</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/questions">Questions</a>
              </li>
              {user.isAdmin && <li className="nav-item">
                <a className="nav-link" href="/users">Users</a>
              </li>}
              <li className="nav-item">
                <a className="nav-link" href="/profile">{user.username}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-fluid justify-content-end">
          {
            user.isLoggedIn ?
              <button
                className="btn btn-danger"
                onClick={(e) => handleLogOut(e)}
              >
                Log Out
              </button>
              :
              <Link
                className="btn btn-success"
                to={"/login"}
                href="#"
              >
                Login
              </Link>
          }
        </div>
      </nav>
    </>
  )
}

export default Navbar;