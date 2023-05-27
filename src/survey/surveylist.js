import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { surveys } from '../index.js'
import { GetDB } from '../universal/manipulateDB.js'
import './surveylist.css'


export function SurveyList() {

    const [survey, setSurvey] = useState([]);
    console.log(survey)
    /* Fetches the API endpoint from surveys in server.js */
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys');
            const data = await result.json();
            console.log(data);
            setSurvey(data)
        };
        fetchData();
    }, []);

    /* Handles the queries in surveybox on the left side */
    function showClosedSurveys() {

        const surveys = [...survey];
        const closedSurveys = surveys.filter(survey => {
            const closeDate = new Date(survey.close_date);
            const currentDate = new Date();
            return closeDate < currentDate;
        });
        console.log(surveys)
        console.log(closedSurveys);
        setSurvey(closedSurveys)
    };

    function showOpenSurveys() {

        const surveys = [...survey];
        const OpenSurveys = surveys.filter(survey => {
            const closeDate = new Date(survey.close_date);
            const currentDate = new Date();
            return closeDate > currentDate;
        });
        console.log(surveys)
        console.log(OpenSurveys);
        setSurvey(OpenSurveys)
    };


    /* This controls the left side of surveylist and is outside the container
       things like Creating surveys or showing open/closed surveys..etc */
    function surveyBox() {
        return (
            <div className="box1">
                <div className="survey_box">
                    <div className="survey_item">
                        <Link to='/create' className='link'>
                            <span>
                                <img src="https://i.imgur.com/5jk9Agu.png" alt='Red plus sign' ></img>
                                <span >Create Survey</span>
                            </span>
                        </Link>
                    </div>
                    <div className="survey_item">
                        <span>
                            <img className="survey_img" src="https://i.imgur.com/5JQGokB.png" alt='Stickman inspecting'></img>
                            <span>Under Review</span>
                        </span>
                    </div>
                    <div className="survey_item">
                        <span className="surveybox_content" onClick={showOpenSurveys}>
                            <img className="survey_img" src="https://i.imgur.com/4hJ5Kcn.png" alt='Red lightning strike icon'></img>
                            <span>Open Surveys</span>
                        </span>
                    </div>
                    <div className="survey_item">
                        <span className="surveybox_content" onClick={showClosedSurveys}>
                            <img className="survey_img" src="https://i.imgur.com/JdLjn2N.png" alt='Green check mark'></img>
                            <span>Closed Surveys</span>
                        </span>
                    </div>
                    <div className="survey_item">
                        <Link to='/surveylist' className='link'>
                            <span>
                                <img className='Survey_icon' src="https://i.imgur.com/W9sbCv6.png" alt='Survey List'></img>
                                <span>Show All</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    /* This is the main part of surveylist that shows the Id / Survey/ Status/ Participants / Edit Button */
    return (
        <div className="surveylist_container">
            <h1 className="enquete_title">Enquêtes</h1>
            <div className="outside">
                {surveyBox()}
                <div className="box2">
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
                <div className="box3">
                </div>
            </div>
        </div>
    );
}
