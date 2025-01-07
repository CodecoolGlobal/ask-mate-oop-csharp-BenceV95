import React from 'react'
import './AskQuestionForm.css';
import { useState } from 'react';

function SubmitQuestion(e) {
    e.preventDefault();
}



const AskQuestionForm = ({ categories }) => {
    
    const [selectedCategory, setSelectedCategory] = useState(0);

    return (
        <>
            <form className='ask' onSubmit={SubmitQuestion}>
                <input type='text' placeholder='Title' name='title' className='title'></input><br />
                <textarea placeholder='body' name='body'></textarea><br />

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
        </>
    )
}

export default AskQuestionForm