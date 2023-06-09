import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './surveylist.css'


export function SurveyList() {
    const [survey, setSurvey] = useState([])
    const [search, setSearch] = useState('')

    

    /* formats the current date to YYYY-MM-DD format.*/
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = String(nowDate.getMonth() + 1).padStart(2, '0')
    const day = String(nowDate.getDate()).padStart(2, '0')
    const currentDate = `${year}-${month}-${day}`


    /* Fetches the API endpoint from surveys in server.js */
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys')
            const data = await result.json()
            setSurvey(data)
        }
        fetchData()
    }, [])

    //checks if user is in sess storage, if not redirect to login page.
    if(localStorage.getItem("user") === null){
        return <Navigate replace to="/login" />;
    }

    /* Handles the queries in surveybox on the left side */

    // Shows every Survey that is under review (is_reviewed = 0)//
    function showBeingReviewed() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys?open=reviewed')
            const data = await result.json()
            setSurvey(data)
        }
        fetchData()
    }

    // Shows all Open Surveys that passed review (is_reviewed = 1) (is_deleted = 0)
    // And current date is not past the close_date. //
    function showOpenSurveys() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys?open=true')
            const data = await result.json()
            setSurvey(data)
        }
        fetchData()
    }

    // Shows all Closed Surveys that passed review (is_reviewed = 1) (is_deleted = 0)
    // And Current date is past the close_date. //
    function showClosedSurveys() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys?open=false')
            const data = await result.json()
            setSurvey(data)
        };
        fetchData()
    }

    // Shows everything. //
    function showAll() {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/surveys')
            const data = await result.json()
            setSurvey(data)
        }
        fetchData()
    }


    /* This controls the left side of surveylist and is outside the container
       things like Creating surveys or showing open/closed surveys..etc */
    function surveyBox() {
        return (
            <div className="box1">
                <div className="survey_box">
                    <div className="survey_item">
                        <Link to='/create' className='link'>
                            <span className="surveybox_content">
                                <img src="https://i.imgur.com/5jk9Agu.png" alt='Red plus sign' ></img>
                                <span >Create Survey</span>
                            </span>
                        </Link>
                    </div>
                    <div className="survey_item">
                        <span className="surveybox_content" onClick={showBeingReviewed}>
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
                        <span className="surveybox_content" onClick={showAll}>
                            <img className='Survey_icon' src="https://i.imgur.com/W9sbCv6.png" alt='Survey List'></img>
                            <span>Show All</span>
                        </span>
                        <input type="text" placeholder='Zoek Enquête..' onChange={(e) => setSearch(e.target.value)}></input>
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
                    <table className='surveylist_table'>
                        <tbody>
                            <tr>
                                <th>Id</th>
                                <th>Titel</th>
                                <th>Status</th>
                                <th>Deelnemers</th>
                                <th>Aanpassen</th>
                            </tr>
                            {survey?.filter((item) => {
                                return search.toLowerCase() === ''
                                    ? item
                                    : item.title.toLowerCase().includes(search);
                            }).map(item => (
                                <tr key={item.Survey_ID}>
                                    <td>
                                        {item.Survey_ID}
                                    </td>
                                    <td className='question__grey'>  {/* links to corresponding Surveyquestion_ID page. */}
                                        <Link to={`/surveyQuestions/${item.Survey_ID}`} className='link'>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td> {/* Conditional checks for Status */}
                                        {(currentDate <= item.close_date && item.is_reviewed == '1') ? (
                                            <p style={{ color: "green" }}>Open</p> // If current date < close_date and item is reviewed.. shows open. //
                                        ) : (currentDate > item.close_date && item.is_reviewed == '1') ? (
                                            <p style={{ color: "red" }}>Closed</p> // if current date > close_date and item is reviewed.. shows closed. //
                                        ) : (item.is_reviewed == '0') ? (
                                            <p style={{ color: "orange" }}>Being Reviewed</p> // if item is not yet reviewed.. shows this. //
                                        ) : (
                                            <p>Unknown Status</p> // If all else fails it becomes Unknown Status. Should not happen.. I hope. //
                                        )
                                        }
                                    </td>
                                    <td>
                                        <p>{item.participants}</p> {/* The amount of participants that answered survey*/}
                                    </td>
                                    <td>
                                        {item.is_reviewed == "0" ? (
                                            // {/* Change this Link to to aanpassen route .*/}
                                            <Link to={`/changesurvey/${item.Survey_ID}`}>
                                                <button className="edit_button">Aanpassen</button>
                                            </Link>
                                        ) :
                                            <p>Gesloten</p>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="box3">
                </div>
            </div>
        </div>
    );
}