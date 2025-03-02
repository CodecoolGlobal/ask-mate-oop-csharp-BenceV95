import React from 'react'
import './AskQuestionForm.css';
import { useState, } from 'react';
import { AuthContext } from '../../AuthContext/AuthContext';
import { Navigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../../utils/api';

const AskQuestionForm = ({ categories }) => {

    const { user } = React.useContext(AuthContext)

    // ask question second
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    // search first
    const [searchResult, setSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [questiondId, setQuestionId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearched(true);
        if (searchQuery.trim()) {
            setTitle(searchQuery);
            fetchQuestions(searchQuery);
        }
    };

    const fetchQuestions = async (query) => {

        try {
            const data = await apiGet(`/Question/search?query=${encodeURIComponent(query)}`);
            setSearchResult(data);

        } catch (error) {
            console.log("fetch failed:", error);
        }
    }

    async function SubmitQuestion(e) {
        e.preventDefault();
        // validate entries !!!!
        try {
            if (selectedCategory === 0) { throw new Error("Category must be set!") }

            const data = await apiPost('/Question', {
                id: "", // modify backend so it doesnt expect unnecesary data (id, userdId etc...)
                userId: "",
                title: title,
                body: body,
                categories: selectedCategory,
            });

            setQuestionId(data.message);

            setResponseMessage("Question Posted");
            setTitle("");
            setBody("");
            setSelectedCategory(0);

        } catch (error) {
            console.log(error);
            setResponseMessage(error.message);
        }
    }

    return (
        <>
            {user.isLoggedIn ?
                <>
                    {
                        !searching ?
                            (<>
                                <form onSubmit={handleSubmit} className='searchForm'>
                                    <input
                                        type='text'
                                        placeholder='Search'
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}
                                    >
                                    </input>
                                    <button type='submit' className='btn btn-success'>Search</button>
                                    {(searched) &&
                                        <button onClick={() => setSearching(true)} className='btn btn-primary'>Ask</button>
                                    }
                                </form>

                                <div className='searchResults'>
                                    {
                                        searchResult.map((result) => {
                                            return (
                                                <div key={result.id} className='searchResult'>
                                                    <h3>{result.title}</h3>
                                                    <p>{result.body}</p>
                                                    <a href={`/questions/${result.id}`} className='btn btn-primary'>View Question</a>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                            )
                            :
                            (<div className='askQuestionFormDiv'>
                                <form className='ask' onSubmit={SubmitQuestion}>
                                    <input
                                        type='text'
                                        placeholder='Title'
                                        name='title'
                                        className='title'
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                    ></input><br />
                                    <textarea placeholder='body' name='body' onChange={(e) => setBody(e.target.value)} value={body}></textarea><br />

                                    <select className="form-select" name='categories' value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                        <option value={0} disabled>Set category</option>
                                        {
                                            categories.map(category => {
                                                return <option key={category.id} value={category.id}>{category.name}</option>
                                            })
                                        }
                                    </select>
                                    <br />
                                    <button className='btn btn-success' type='submit'>Ask</button>
                                </form>
                                {
                                    responseMessage &&
                                    <div>
                                        <p className='responseMessage'>{responseMessage}</p>
                                        <a href={`/questions/${questiondId}`} className='btn btn-primary'>View Your Question</a>
                                    </div>
                                }
                            </div>)
                    }
                </> : <Navigate to={"/unauthorized"} />


            }


        </>

    )
}

export default AskQuestionForm