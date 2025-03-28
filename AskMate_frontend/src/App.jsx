import { useState, useEffect } from "react";
import "./App.css";
import ErrorPage from "./Components/Pages/ErrorPage/UnauthorizedPage";
import Navbar from "./Components/Navbar/Navbar";
import RegistrationForm from "./Components/Forms/RegistrationForm/RegistrationForm";
import LoginForm from "./Components/Forms/LoginForm/LoginForm";
import MainPage from "./Components/Pages/MainPage/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import QuestionsPage from "./Components/Pages/QuestionsPage/QuestionsPage";
import UsersPage from "./Components/Pages/UsersPage/UsersPage";
import { AuthContext } from "./Components/AuthContext/AuthContext";
import { useContext } from "react";
import AskQuestionForm from "./Components/Forms/AskQuestionForm/AskQuestionForm";
import AnswerPage from "./Components/Pages/AnswerPage/AnswerPage";
import UserPage from "./Components/Pages/UserPage/UserPage";
import Footer from "./Components/Footer/Footer";
import Missing from "./Components/Pages/ErrorPage/Missing";
import { apiGet, apiPost } from "./utils/api";
import About from "./Components/Pages/About/About";
import PrivacyPolicy from "./Components/Pages/Privacy/PrivacyPolicy";
import Contact from "./Components/Pages/Contact/Contact";
import Profile from "./Components/Pages/Profile/Profile";

function App() {
  const { user, setUser } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  console.log("users:", users);

  async function loginUser(username, password) {
    try {
      //comes back with user meta data
      const response = await apiPost("/User/login", { username, password });
      console.log("resp", response);
      sessionStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      navigate("/");
    } catch (error) {
      return error;
    }
  }

  async function logOutUser() {
    try {
      const response = await apiPost("/User/logout");
      sessionStorage.removeItem("user");
      navigate("/"); // this doesnt seem to work unfortunatelly
      setUser(null);
      setResponseMessage(response);
    } catch (error) {
      console.log("error", error);
      setResponseMessage("error during logout");
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

    if (user) {
      loadData();
    }
  }, []);

  function handleLogOut(e) {
    e.preventDefault();
    logOutUser();
  }

  console.log("usersinApp", users);

  return (
    <>
      <Navbar handleLogOut={handleLogOut} />
      <main>
        <Routes>
          {/* unprotected */}
          <Route path="/" element={<MainPage />} />
          <Route
            path="/login"
            element={<LoginForm navigate={navigate} loginUser={loginUser} />}
          />
          <Route
            path="/register"
            element={<RegistrationForm navigate={navigate} />}
          />
          <Route path="/unauthorized" element={<ErrorPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<Contact />} />
          {/* Protected */}
          <Route
            path="/questions"
            element={
              <QuestionsPage
                questions={questions}
                categories={categories}
                setQuestions={setQuestions}
              />
            }
          />
          <Route path="/users" element={<UsersPage users={users} />} />
          <Route
            path="/ask"
            element={<AskQuestionForm categories={categories} />}
          />
          <Route
            path="/questions/:id"
            element={<AnswerPage categories={categories} users={users} />}
          />
          <Route
            path="/users/:username"
            element={
              <UserPage
                questions={questions}
                categories={categories}
                users={users}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="*" element={<Missing />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
