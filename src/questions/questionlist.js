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

    console.log('dit is' + question.options)
    return (
        <div>
            <h1> Vragenlijst </h1>
            <table width='100%'>
                <tr>
                    <th>Id</th>
                    <th>Vraag</th>
                </tr>
                {question.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className='question__grey'>
                            <Link to={`/question/${item.id}`} className='link'>{item.question}</Link>
                        </td>
                        <td>
                            <button className='close_button' onClick={() => setQuestion(question.filter(q =>
                                q.id !== item.id))}>
                                <img src="https://i.imgur.com/AhBVm9H.png" height="20px" alt="Red X Button">
                                </img>
                            </button>
                        </td>
                    </tr>
                ))}

            </table>
        </div>
    )
}

export default modifyQuestion
