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
                    <th>Aanpassen</th>
                </tr>
                {question.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.question}</td>
                        <td>
                            <Link to={`/question/${item.id}`} className='link'><button>Aanpassen</button></Link>
                            <button className='button' onClick={() => setQuestion(question.filter(q =>
                                q.id !== item.id))}>Verwijder</button>
                        </td>
                    </tr>
                ))}

            </table>
        </div>
    )
}


export default modifyQuestion

/* I might still need this for question page 
{/* <button className='button' onClick={() => handleModify(item.id, name)}>Modify</button> */ 