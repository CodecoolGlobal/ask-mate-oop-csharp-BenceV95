import LoginForm from "../Forms/LoginForm/LoginForm";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import React from "react";
import { Button } from "bootstrap";

const Navbar = ({ handleLogOut }) => {

  const { isLoggedIn, loggedInUsername } = React.useContext(AuthContext)




  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">AskApe</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/questions">Questions</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/users">Users</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {loggedInUsername}
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">My questions</a></li>
                  <li><a className="dropdown-item" href="#">My answers</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
              </li>
              <li className="nav-item align-self-center"> {/*align self center doesnt work here for some reason, todo: make it centered*/}
                <form className="d-flex" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
              </li>
            </ul>
          </div>
          {isLoggedIn ? <button className="btn btn-outline-success" onClick={(e) => handleLogOut(e)} >Log Out</button> : <Link className="nav-link" to={"/login"} href="#">Login</Link>}
        </div>
      </nav>
    </div>
  )
}

export default Navbar;