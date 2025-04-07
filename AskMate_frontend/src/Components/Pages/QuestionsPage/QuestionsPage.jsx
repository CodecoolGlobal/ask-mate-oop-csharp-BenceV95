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

  const [searchResult, setSearchResult] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQuestions("", 0, 10);
    }
  }, []);

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
            <div className="categoriesDiv">
              <Tags categories={categories} selector={setSelectedCategory} />
            </div>

            {/* <SearchDiv onSearch={fetchQuestions} /> */}

            <div className="questionsDiv">
              {questions.map((question, i) => {
                return (
                  <QuestionCard
                    key={i} // so it stops complaining even though it is set under the component...
                    user={user}
                    categories={categories}
                    question={question}
                  />
                );
              })}
            </div>
          </div>
        )
      ) : (
        <Navigate to={"/unauthorized"} />
      )}
    </>
  );
}
