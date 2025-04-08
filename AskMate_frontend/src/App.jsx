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
import Tos from "./Components/Pages/Tos/Tos";

function App() {
  const { user } = useContext(AuthContext);

  //const [questions, setQuestions] = useState([]);
  //const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
 

  //fetch all necessary data
  useEffect(() => {
    
    const loadData = async () => {
      try {
        // endpoint options: "/Question/filter?categoryId={int}&limit={0<l<1000}"
        //const questions = await apiGet("/Question/filter");
        //const fetchedUsers = await apiGet("/User/allUsers");
        const categories = await apiGet("/categories");
        setCategories(categories);        
        //setUsers(fetchedUsers);
        //setQuestions(questions);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (user && categories.length === 0) {
      loadData();
    }
  }, [user]);


  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* unprotected */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginForm navigate={navigate} />} />
          <Route
            path="/register"
            element={<RegistrationForm navigate={navigate} />}
          />
          <Route path="/unauthorized" element={<ErrorPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tos" element={<Tos />} />
          <Route path="*" element={<Missing />} />

          {/* Protected */}          
          <Route
            path="/questions"
            element={<QuestionsPage categories={categories} />}
          />
          <Route path="/users" element={<UsersPage />} />
          <Route
            path="/ask"
            element={<AskQuestionForm categories={categories} />}
          />
          <Route
            path="/questions/:id"
            element={<AnswerPage categories={categories} />}
          />
          <Route
            path="/users/:username"
            element={<UserPage categories={categories} />}
          />
          <Route path="/profile" element={<Profile />} />          
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
