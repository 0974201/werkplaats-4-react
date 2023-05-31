import React from 'react';
import { useState, useEffect } from 'react';
import './questionlist.css';
import { Link } from 'react-router-dom';
import { GetDB, DeleteDB } from '../universal/manipulateDB.js'


function ModifyQuestion() {
    const [question, setQuestion] = useState([]);
    const [search, setSearch] = useState('')
    const [message, showMessage] = React.useState(false)



    /* This should fetch the data asynchronously if you import GetDB */
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions?open=true');
            const data = await result.json();
            console.log(data);
            setQuestion(data)
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                showMessage('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    async function DeleteQuestion(questionId) {
        if (window.confirm(`Weet je zeker dat je vraag ${questionId} wil verwijderen?`)) {
            try {
                const array = {
                    is_deleted: '1',
                    questionId: questionId,
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
                showMessage(`Vraag ${questionId} is verwijderd`);
            } catch (error) {
                console.log('error!!', error)
            }

        }
    };

    async function RetrieveQuestion(questionId) {
        if (window.confirm(`Weet je zeker dat je vraag ${questionId} wil herstellen?`)) {
            try {
                const array = {
                    is_deleted: '0',
                    questionId: questionId,
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
                showMessage(`Vraag ${questionId} is hersteld`);
            } catch (error) {
                console.log('error!!', error)
            }

        }
    };


    function showQuestions() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions?open=notdeleted');
            const data = await result.json();
            setQuestion(data)
        };
        fetchData();
    };

    function showDeleted() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions?open=isdeleted');
            const data = await result.json();
            setQuestion(data)
        };
        fetchData();
    };

    function showOpenQuestions() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions?open=OpenQuestions');
            const data = await result.json();
            setQuestion(data)
        };
        fetchData();
    };

    function showMultipleChoice() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/questions?open=MultipleChoiceQuestions');
            const data = await result.json();
            setQuestion(data)
        };
        fetchData();
    };

    function questionBox() {
        return (
            <>
                <div className="questionlist_box1">
                    <div className="questionlist_filter_box">
                        <div className='questionlist_filter_item'>
                            <div className='questionlist_filter_content' onClick={showQuestions}>
                                <span>Alle Vragen</span>
                            </div>
                        </div>
                        <div className='questionlist_filter_item'>
                            <div className='questionlist_filter_content' onClick={showOpenQuestions}>
                                <span>Open Vragen</span>
                            </div>
                        </div>
                        <div className='questionlist_filter_item'>
                            <div className='questionlist_filter_content' onClick={showMultipleChoice}>
                                <span>Multiple Choice</span>
                            </div>
                        </div>
                        <div className='questionlist_filter_item'>
                            <div className='questionlist_filter_content' onClick={showDeleted}>
                                <span>Prullenbak</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="surveylist_container">
            <div
                className={`questionlist_message ${message ? 'alert-shown' : 'alert-hidden'}`}
            >
                {message && (
                    <p className="error"> {message} </p>
                )}
            </div>
            <h1 className="enquete_title">Vragenlijst</h1>
            <div className="outside">
                {questionBox()}
                <div className='questionlist_box2'>
                    <div className='questionlist_filter_search'>
                        <input type='text' placeholder='Zoek Vraag..' onChange={(e) => setSearch(e.target.value)}></input>
                    </div>
                    <table width='100%'>
                        <tbody>
                            <tr>
                                <th>Id</th>
                                <th>Vraag</th>
                                <th>Type</th>
                                <th>Overzicht</th>
                                <th>Aanpassen</th>
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
                                    <td> {item.Open_Question_ID != 'NULL' ?
                                        <span>Open</span>

                                        : <span>Multiple Choice</span>
                                    }
                                    </td>
                                    <td className='questionlist_data'>
                                        <span>
                                            <Link to={`/overview/${item.Question_ID}`} className='link'>
                                                <span>Aanpassen</span>
                                            </Link>
                                        </span>
                                    </td>
                                    <td> {(item.is_deleted == '0') ?
                                        <button className='close_button' onClick={() => DeleteQuestion(item.Question_ID)}
                                        > <span>Verwijder</span>
                                        </button>
                                        /* shows different button if deleted*/
                                        : <button className='close_button' onClick={() => RetrieveQuestion(item.Question_ID)}
                                        > <span>Herstel</span>
                                        </button>
                                    }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='questionlist_box3'>
                </div>
            </div>
        </div >
    )
}
export default ModifyQuestion

