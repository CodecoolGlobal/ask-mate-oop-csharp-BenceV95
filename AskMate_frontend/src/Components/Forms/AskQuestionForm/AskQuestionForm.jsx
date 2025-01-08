import React from 'react'
import './AskQuestionForm.css';
import { useState, useContext } from 'react';
import { AuthContext } from "../../AuthContext/AuthContext"





const AskQuestionForm = ({ categories }) => {
    
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const { userId } = useContext(AuthContext);

    console.log(selectedCategory);
    
    async function SubmitQuestion(e) {
        e.preventDefault();
        // validate entries !!!!
        try {
            const response = await fetch('http://localhost:5166/Question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id:"",
                userId: "",
                title: title,
                body: body,
                categories: selectedCategory,
            }),
            credentials: 'include'
          });

          setResponseMessage("Question Posted");
          setTitle("");
          setBody("");
          setSelectedCategory(0);

        } catch (error) {
            console.log(error);
            setResponseMessage(error);            
        }
    }
    
    return (
        <div className='askQuestionFormDiv'>
            <form className='ask' onSubmit={SubmitQuestion}>
                <input type='text' placeholder='Title' name='title' className='title' onChange={(e) => setTitle(e.target.value)} value={title}></input><br />
                <textarea placeholder='body' name='body' onChange={(e) => setBody(e.target.value)} value={body}></textarea><br />

                <select className="form-select" name='categories' value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value={0} disabled>Set category</option>
                    {
                        categories.map(category => {
                            return <option key={category.id} value={category.id}>{category.name}</option>
                        })
                    }
                </select>
<br/>
                <button className='btn btn-success' type='submit'>Ask</button>
            </form>
            <p>{responseMessage}</p>
        </div>
    )
}

export default AskQuestionForm