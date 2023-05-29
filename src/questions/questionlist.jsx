import React from 'react';
import { useState, useEffect } from 'react';
import './questionlist.css';
import { Link } from 'react-router-dom';
import { GetDB, DeleteDB } from '../universal/manipulateDB.js'


function ModifyQuestion() {
    const [question, setQuestion] = useState([]);
    const [search, setSearch] = useState('')
    const [deletemessage, showDeleteMessage] = useState('')


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

    async function DeleteQuestion(questionId) {
        if (window.confirm('Weet je zeker?')) {
            try {
                const array = {
                    questionId: questionId
                }
                await fetch(`http://localhost:81/api/questions`, {
                    method: "PUT",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(array)
                });

                setQuestion((question => question.filter(q =>
                    q.Question_ID !== questionId)));
                showDeleteMessage(`Vraag ${questionId} is verwijderd`);
                console.log('deleted successfully')
            } catch (error) {
                console.log('error!!', error)
            }

        }
    };


    return (
        <div className="questionlist_table">
            <h1 className="questionlist_title">Vragenlijst</h1>
            {deletemessage && (
                <p className="error"> {deletemessage} </p>
            )}
            <div className='questionlist_search'>
                <input type='text' placeholder='Zoek Vraag' onChange={(e) => setSearch(e.target.value)}></input>
            </div>
            <table width='100%'>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Vraag</th>
                        <th>Deelnemers</th>
                        <th>Overzicht</th>
                        <th>Verwijderen</th>
                    </tr>
                    {question.filter((item) => {
                        return search.toLowerCase() === ''
                            ? item
                            : item.question.toLowerCase().includes(search)
                    }).map(item => (
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
                            <td> {console.log(item.Question_ID)}
                                <button className='close_button' onClick={() => DeleteQuestion(item.Question_ID)}
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