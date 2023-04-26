import React from 'react';
import { useState } from 'react';
import './questions.css';
import { questions } from '../index.js'
import { Question } from '../survey/survey'
import { Link } from 'react-router-dom';

function modifyQuestion() {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState(questions);
    let nextId = 0

    const handleModify = (id, newQuestion) => {
        let updatedQuestion = question.map(question => {
            if (question.id === id) {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        setQuestion(updatedQuestion);
    };
    console.log('dit is' + question.options)
    return (
        <div>
            <h1> Questions </h1>
            {question.map(item => (
                <div key={item.id}> {item.id + '. ' + item.question} <br></br>
                    {item.type === 'MultipleChoice' &&
                        <>
                            <ul>
                                {item.options.map(option => (
                                    <label key={option.id}>
                                        <input type={"radio"} value={option} name={"question" + option.id} />
                                        {option}
                                    </label>

                                ))}
                            </ul>
                        </>}
                    <textarea className='input' value={item.name} onChange={e => setName(e.target.value)} />
                    <Link to='/question' className='link'><button>Modify</button></Link>
                    <button className='button' onClick={() => setQuestion(question.filter(q =>
                        q.id !== item.id))}>Delete</button>


                </div>
            ))}
        </div>
    )
}


export default modifyQuestion

/* I might still need this for question page 
{/* <button className='button' onClick={() => handleModify(item.id, name)}>Modify</button> */ 