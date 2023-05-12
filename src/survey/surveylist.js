import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../index.js'
import { Question } from './survey.js'
import './surveylist.css'


/* ChatGPT suggested this. */

export function SurveyList() {
    const [question] = useState(questions);
    return (
        <>
            <div>
                <div className="outside">
                    <div className="survey_box">
                        <p>Create Survey</p>
                        <p>Under Review</p>
                        <p>Open</p>
                        <p>Closed</p>
                        <p>Show All</p>
                    </div>
                </div>
                <h1>Enquêtes</h1>
                <table width='100%'>
                    <tr>
                        <th>Id</th>
                        <th>Enquête</th>
                        <th>Status</th>
                        <th>Aanpassen</th>
                    </tr>
                    {question.map(item => (
                        <tr key={item.id}>
                            <td>
                                {item.id}
                            </td>
                            <td className='question__grey'>
                                <Link to={`/survey/${item.id}`} className='link'>{item.question}</Link>
                            </td>
                            <td>
                                <p>Open</p>
                            </td>
                            <td>
                                <button className="edit_button">Edit</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>

        </>
    );
}
