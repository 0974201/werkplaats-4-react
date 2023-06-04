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
    let surveytitle = survey.map(item => item.title)

    return (
        <>
            <div>
                <h1 className='surveyquestion_title'> {surveytitle}</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <th>Antwoorden</th>
                            <th>Type</th>
                            <th>Tijd</th>
                            <th>User ID</th>
                        </tr>
                        {
                            survey.map(item => (
                                <tr key={item.Survey_ID}> {console.log(item)}
                                    <td>
                                        <span>{item.Survey_ID}</span>
                                    </td>
                                    <td className='question__grey'>
                                        <span>antwoorden place</span>
                                    </td>
                                    <td>
                                        placeholder
                                    </td>
                                    <td>
                                        wewe
                                    </td>
                                    <td>
                                        placeholder
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