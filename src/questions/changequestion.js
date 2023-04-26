import React, { useState } from 'react';
import './questions.css';
import { useParams } from 'react-router-dom';
import { questions } from '../index.js'


export default function ChangeQuestion({ question }) {
    const [name, setName] = useState('')
    const { id } = useParams();
    console.log(question[id].question)
    console.log(id)

    const handleModify = (id, newQuestion) => {
        const [question, setQuestion] = useState(questions);

        let updatedQuestion = questions.map(question => {
            if (question.id === id) {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        setQuestion(updatedQuestion);
    };


    return (
        <div>
            <h1> Change Question {id}</h1>
            <p>{question[id].question}</p>
            <input className='input' value={question.name} onChange={e => setName(e.target.value)}></input>
            <button className='button' onClick={() => handleModify(id, name)}>Modify</button>
        </div>
    )
}
