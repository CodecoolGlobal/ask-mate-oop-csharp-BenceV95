import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Tags from "./Tags";
import "./QuestionsPage.css";
import SearchDiv from "./SearchDiv";
import QuestionCard from "../../QuestionCard/QuestionCard";
import { apiGet } from "../../../utils/api";
import LoadingPage from "../LoadingPage/LoadingPage";

export default function QuestionsPage({ categories }) {
  const { user } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [activeButton, setActiveButton] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (categoryId) => {
    if (activeButton === categoryId) {
      setActiveButton(null);
      setSelectedCategory(0);
    } else {
      setActiveButton(categoryId);
      setSelectedCategory(categoryId);
    }
  };

  useEffect(() => {
    const handleCategorySwitch = async () => {
      if (user && selectedCategory == 0) {
        console.log("fetching all questions");
        await fetchQuestions("", 0, 100);
      }
      if (user && selectedCategory != 0) {
        console.log("fetching questions from category: " + selectedCategory);

        await fetchQuestions("", selectedCategory, 10);
      }
    };

    handleCategorySwitch();
  }, [selectedCategory, user]);

  const fetchQuestions = async (searchString, categoryId, limit) => {
    setLoading(true);

    try {
      let data;
      if (searchString != "") {
        // search only returns 10 questions from the backend !
        data = await apiGet("/Question/search?query=" + searchString);
      } else {
        // endpoint options: "/Question/filter?categoryId={int}&limit={0<l<1000}"
        // make sure to set categoryId to 0 if you want to fetch all questions(no filter)
        data = await apiGet(
          `/Question/filter?categoryId=${categoryId}&limit=${limit}`
        );
      }
      setQuestions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user ? (
        loading ? (
          <LoadingPage />
        ) : (
          <div className="mainDiv">
            <div className="d-flex flex-column gap-3">
              <div className="categoriesDiv">
                <Tags
                  categories={categories}
                  activeButton={activeButton}
                  onCategorySelect={handleCategorySelect}
                />
              </div>
              <SearchDiv onSearch={fetchQuestions} />
            </div>

            <div className="questionsDiv">
              {questions.length == 0 ? (
                <h1>No Question in this category yet !</h1>
              ) : (
                questions.map((question, i) => {
                  return (
                    <QuestionCard
                      key={i}
                      user={user}
                      categories={categories}
                      question={question}
                    />
                  );
                })
              )}
            </div>
          </div>
        )
      ) : (
        <Navigate to={"/unauthorized"} />
      )}
    </>
  );
}
