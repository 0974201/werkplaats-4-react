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
            <h1> Question List </h1>
            <table width='100%'>
                <tr>
                    <th>Id</th>
                    <th>Question</th>
                    <th>Modify</th>
                </tr>
                {question.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.question}</td>
                        <td>
                            <Link to={`/question/${item.id}`}><button className='button'>Modify</button></Link>
                            <button className='button' onClick={() => setQuestion(question.filter(q =>
                                q.id !== item.id))}>Delete</button>
                        </td>
                    </tr>
                ))}

            </table>
        </div>
    )
}

export default modifyQuestion
