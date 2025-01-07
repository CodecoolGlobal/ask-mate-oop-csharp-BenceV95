import { useState, useEffect } from 'react'
import './App.css'
import ErrorPage from './Components/Pages/ErrorPage/ErrorPage'
import Navbar from './Components/Navbar/Navbar';
import RegistrationForm from './Components/Forms/RegistrationForm/RegistrationForm';
import LoginForm from './Components/Forms/LoginForm/LoginForm';
import MainPage from './Components/Pages/MainPage/MainPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import QuestionsPage from './Components/Pages/QuestionsPage/QuestionsPage';
import UsersPage from './Components/Pages/UsersPage/UsersPage';
import { AuthContext } from './Components/AuthContext/AuthContext';
import { useContext } from 'react';


function App() {

  const { setIsLoggedIn, setLoggedInUser, refreshSession } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // useEffect(()=>{
  // console.log(username)
  // },[username])

  function setResponseMessage(message) {
    console.log(message);
  }


  async function loginUser(username, password) {
    try {
      const response = await fetch('http://localhost:5166/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // this is how you include cookies with the request
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage('Login sucsessful!');
        await refreshSession(); //not so elegant
        navigate("/")
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while logging in.');
    };
  }



  async function logOutUser() {
    try {
      const response = await fetch("http://localhost:5166/User/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include"
      })
      const result = await response.json();
      if (response.ok) {
        setResponseMessage("logout successful")
        await refreshSession(); //also, not elegant..
      } else {
        setResponseMessage("error during logout")
      }
    } catch (error) {
      console.log("error", error)
    }
  }



  //basic data fetching function
  async function fetchData(url) {
    const response = await fetch(url, {
      credentials: "include" //must include credidentials so the backend knows we are logged in!
    })
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error during fetching data!")
    }
  }

  //fetch all necessary data
  useEffect(() => {
    const loadData = async () => {
      try {
        const questions = await fetchData("http://localhost:5166/Question");
        const users = await fetchData("http://localhost:5166/User/allUsers");
        const categories = await fetchData("http://localhost:5166/categories");
        setCategories(categories);
        setUsers(users);
        setQuestions(questions);
      } catch (err) {
        console.log(err.message);
      }
    };
    loadData();
    console.log("questions:1", questions)
  }, []);


  async function registerNewUser(e, username, email, password) {
    e.preventDefault();
    try {      
      const response = await fetch('http://localhost:5166/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      //const result = await response.json();
      //console.log(result);
      if (response.ok) {
        setResponseMessage('Registration successful!');
        navigate("/")
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while registering.');
    };
  }



  function handleLogOut(e) {
    e.preventDefault();
    logOutUser()
  }



  return (
    <>
      <Navbar handleLogOut={handleLogOut} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginForm navigate={navigate} loginUser={loginUser} />} />
        <Route path="/register" element={<RegistrationForm registerNewUser={registerNewUser} />} />
        <Route path="/questions" element={<QuestionsPage questions={questions} categories={categories} />} />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </>
  );
};


export default App

