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
import { apiGet, apiPost } from './utils/api';
import About from './Components/Pages/About/About';

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
      const response = await apiPost('/User/login', { username, password });
      console.log(response)
      await refreshSession(); //not so elegant
      navigate("/")

    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while logging in.');
    };
  }



  async function logOutUser() {
    try {
      const response = await apiPost("/User/logout")
      setResponseMessage(response)
      navigate("/")
      await refreshSession(); //also, not elegant..
    } catch (error) {
      console.log("error", error)
      setResponseMessage("error during logout")
    }
  }



  //fetch all necessary data
  useEffect(() => {
    const loadData = async () => {
      try {
        const questions = await apiGet("/Question");
        const fetchedUsers = await apiGet("/User/allUsers");
        const categories = await apiGet("/categories");
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
          <Route path="/unauthorized" element={<ErrorPage />} />
          <Route path="/ask" element={<AskQuestionForm categories={categories} />} />
          <Route path="/questions/:id" element={<AnswerPage categories={categories} users={users} />} />
          <Route path="/users/:username" element={<UserPage questions={questions} categories={categories} users={users} />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<Missing />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};


export default App