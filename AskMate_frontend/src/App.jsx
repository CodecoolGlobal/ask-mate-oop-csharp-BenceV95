import { useState, useEffect } from 'react'
import './App.css'
import ErrorPage from './Components/Pages/ErrorPage/UnauthorizedPage'
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
import AskQuestionForm from './Components/Forms/AskQuestionForm/AskQuestionForm';
import AnswerPage from './Components/Pages/AnswerPage/AnswerPage';
import UserPage from './Components/Pages/UserPage/UserPage';
import Footer from './Components/Footer/Footer';
import Missing from './Components/Pages/ErrorPage/Missing';


function App() {

  const { user, refreshSession } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  function setResponseMessage(message) {
    console.log(message);
  }
  console.log("users:", users)

  async function loginUser(username, password) {
    try {
      const response = await fetch('/api/User/login', {
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
      const response = await fetch("/api/User/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include"
      })
      const result = await response.json();
      if (response.ok) {
        setResponseMessage("logout successful")
        navigate("/")
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
        const questions = await fetchData("/api/Question");
        const fetchedUsers = await fetchData("/api/User/allUsers");
        const categories = await fetchData("/api/categories");
        setCategories(categories);
        setUsers(fetchedUsers);
        setQuestions(questions);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (user.isLoggedIn) {
      loadData();
    }

    //console.log("questions:1", questions)
  }, []);






  function handleLogOut(e) {
    e.preventDefault();
    logOutUser()
  }

  console.log("usersinApp", users)

  return (
    <>
      <Navbar handleLogOut={handleLogOut} />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginForm navigate={navigate} loginUser={loginUser} />} />
          <Route path="/register" element={<RegistrationForm navigate={navigate} />} />
          <Route path="/questions" element={<QuestionsPage questions={questions} categories={categories} setQuestions={setQuestions} />} />
          <Route path="/users" element={<UsersPage users={users} />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/ask" element={<AskQuestionForm categories={categories} />} />
          <Route path="/questions/:id" element={<AnswerPage fetchData={fetchData} categories={categories} users={users} />} />
          <Route path="/users/:username" element={<UserPage questions={questions} categories={categories} users={users} />} />
          <Route path='*' element={<Missing />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};


export default App