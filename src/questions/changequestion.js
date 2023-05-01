import React, { useState } from 'react';
import './questions.css';
import { useParams } from 'react-router-dom';
import { questions } from '../index.js'


export default function ChangeQuestion({ question }) {
    const [value, setValue] = useState('')
    const { id } = useParams();
    const [questionlist, setQuestion] = useState(questions);
    console.log(question[id].question)
    console.log(id)
    console.log(question)


    const handleModify = (id, newQuestion) => {
        console.log('dit woss ' + id, newQuestion);

        let updatedQuestion = questionlist.map(question => {
            if (question.id === id) {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        console.log('dit is ' + setQuestion)
        setQuestion(updatedQuestion);
        question[id].question = newQuestion;
    };

    console.log(questionlist)
    return (
        <div>
            <h1> Change Question {id}</h1>
            <p>{questionlist[id].question}</p>
            <input type='text' className='input' value={value} onChange={e => setValue(e.target.value)}></input>
            <button className='button' onClick={() => handleModify(id, value)}>Modify</button>
        </div>
    )
}
