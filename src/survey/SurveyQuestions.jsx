import React, { useState, useEffect, } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GetDB } from '../universal/manipulateDB.js'
import './surveyquestions.css'

function SurveyQuestions() {
    const [survey, setSurvey] = useState([])
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:81/api/surveys/${id}`);
            const data = await result.json();
            setSurvey(data)
        };
        fetchData();
    }, []);

    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Titel</th>
                        <th>Status</th>
                        <th>Deelnemers</th>
                        <th>Aanpassen</th>
                    </tr>
                    {
                        survey.map(item => (
                            <tr key={item.Survey_ID}>
                                <td>
                                    {item.Survey_ID}
                                </td>
                                <td className='question__grey'>
                                    <Link to={`/surveyQuestions/${item.Survey_ID}`} className='link'>
                                        {item.title}
                                    </Link>
                                </td>
                                <td>

                                </td>
                                <td> {console.log(item)}
                                    <p>{item.participants}</p>
                                </td>
                                <td>
                                    {item.is_reviewed == "0" ? (
                                        // {/* Change this Link to to aanpassen route .*/}
                                        <Link to='/create'>
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
        </>
    )
}

export default SurveyQuestions