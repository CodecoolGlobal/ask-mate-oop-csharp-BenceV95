import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import React, { useState } from "react";

const Navbar = ({ handleLogOut }) => {

  const { user } = React.useContext(AuthContext);

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  //console.log("inNavbar", user)

  return (
    <>
      <nav className="navbar navbar-expand-sm mb-2 bg-primary text-white">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">AskApe</Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navbarSupportedContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/questions" onClick={closeNav}>Questions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ask" onClick={closeNav}>Ask</Link>
              </li>
              {user.isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to={`/users/${user.username}`} onClick={closeNav}>Profile</Link>
                </li>
              )}
              {user.isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/users" onClick={closeNav}>Users(Admin panel)</Link>
                </li>)}
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                {user.isLoggedIn ? (
                  <button className="btn btn-danger" onClick={(e) => { handleLogOut(e); closeNav(); }}>
                    Log Out
                  </button>
                ) : (
                  <Link className="btn btn-success" to="/login" onClick={closeNav}>
                    Login
                  </Link>
                )}
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar;