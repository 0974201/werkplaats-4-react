import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { surveys } from '../index.js'
import './surveylist.css'


export function SurveyList() {

    const [survey] = useState(surveys);


    /* This controls the left side of surveylist and is outside the container
       things like Creating surveys or showing open/closed surveys..etc */
    function surveyBox() {
        return (
            <>
                <div className="outside">
                    <div className="survey_box">
                        <Link to='/create' className='link'>
                            <p>
                                <img src="https://i.imgur.com/5jk9Agu.png" alt='Red plus sign' ></img>
                                Create Survey
                            </p>
                        </Link>
                        <p>
                            <img src="https://i.imgur.com/5JQGokB.png" alt='Stickman inspecting'></img>
                            Under Review
                        </p>
                        <p>
                            <img src="https://i.imgur.com/4hJ5Kcn.png" alt='Red lightning strike icon'></img>
                            Open
                        </p>
                        <p>
                            <img src="https://i.imgur.com/JdLjn2N.png" alt='Green check mark'></img>
                            Closed
                        </p>
                        <Link to='/surveylist' className='link'>
                            <p>
                                <img className='Survey_icon' src="https://i.imgur.com/W9sbCv6.png" alt='Survey List'></img>
                                Show All
                            </p>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    /* This is the main part of surveylist that shows the Id / Survey/ Status/ Participants / Edit Button */
    return (
        <>
            <div>
                {surveyBox()}
                <h1>Enquêtes</h1>
                <table width='100%'>
                    <tr>
                        <th>Id</th>
                        <th>Titel</th>
                        <th>Status</th>
                        <th>Deelnemers</th>
                        <th>Aanpassen</th>
                    </tr>
                    {survey.map(item => (
                        <tr key={item.id}>
                            <td>
                                {item.id}
                            </td>
                            <td className='question__grey'>
                                <Link to={`/survey/${item.id}`} className='link'>
                                    {item.title}
                                </Link>
                            </td>
                            <td>
                                {item.status === "Open" ? (
                                    <p style={{ color: "red" }}>{item.status}</p>
                                ) : item.status === "Closed" ? (
                                    <p style={{ color: "green" }}>{item.status}</p>
                                ) : (
                                    <p style={{ color: "orange" }}>{item.status}</p>
                                )
                                }
                            </td>
                            <td>
                                <p>{item.participants}</p>
                            </td>
                            <td>
                                {item.status === "Being reviewed" ? (
                                    <button className="edit_button">Aanpassen</button>
                                ) :
                                    <p>Gesloten</p>
                                }
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    );
}