import React from 'react';
import { useState, useEffect } from 'react';
import './questions.css';
import { Link } from 'react-router-dom';
import { GetDB } from '../universal/manipulateDB.js'


function ModifyQuestion() {
    const [question, setQuestion] = useState([]);

    /* This should fetch the data asynchronously if you import GetDB */
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions');
            const data = await result.json();
            console.log(data);
            setQuestion(data)
        };
        fetchData();
    }, []);

    return (
        <div className="questionlist_table">
            <h1 className="questionlist_title">Vragenlijst</h1>
            <table width='100%'>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Vraag</th>
                        <th>Deelnemers</th>
                        <th>Overzicht</th>
                        <th>Verwijderen</th>
                    </tr>
                    {question?.map(item => (
                        <tr key={item.Question_ID}>
                            <td>
                                {item.Question_ID}
                            </td>
                            <td className='question__grey'> {console.log(item)}
                                <Link to={`/question/${item.Question_ID}`} className='link'>
                                    {item.question}
                                </Link>
                            </td>
                            <td>
                                <span>Deelnemers</span>
                            </td>
                            <td className='questionlist_data'>
                                <span>
                                    <Link to={`/overview/${item.Question_ID}`} className='link'>
                                        <span>Antwoorden</span>
                                    </Link>
                                </span>
                            </td>
                            <td>
                                <button className='close_button' onClick={() => {
                                    if (window.confirm('Weet je zeker?')) {
                                        setQuestion(question => question.filter(q =>
                                            q.Question_ID !== item.Question_ID))
                                    }
                                }}
                                > Verwijder
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ModifyQuestion
