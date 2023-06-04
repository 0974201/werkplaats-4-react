import React, { useState, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import './surveyquestions.css'

function SurveyQuestions() {
    const [survey, setSurvey] = useState([])
    const { id } = useParams();

    /* fetches the data from api surveys:ID*/
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:81/api/surveys/${id}`);
            const data = await result.json();
            setSurvey(data)
        };
        fetchData();
    }, []);
    /* grabs the title outside the map */
    let surveytitle = survey?.map(item => item.title)
    console.log(survey)
    return (
        <>
            <div>
                <h1 className='surveyquestion_title'> {surveytitle}</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Antwoorden</th>
                            <th>Type</th>
                            <th>Tijd</th>
                            <th>User ID</th>
                        </tr>
                        {
                            survey && survey?.map(item => (
                                <tr key={item.Survey_ID}> {console.log(item)}
                                    <td className='question__grey'>
                                        <span>{item.answer}</span>
                                    </td>
                                    <td> {item.open_question !== null ?
                                        <span>Open</span>
                                        :
                                        <span>Multiple Choice</span>
                                    }
                                    </td>
                                    <td>
                                        <span>{item.date_answered}</span>
                                    </td>
                                    <td>
                                        <span>{item.User_ID}</span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default SurveyQuestions