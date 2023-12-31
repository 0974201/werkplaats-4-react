import React, { useState, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import './surveyquestions.css'

function SurveyQuestions() {
    const [survey, setSurvey] = useState([])
    const { id } = useParams();
    const [showAnswer, setShowAnswer] = useState(false)
    const [answer, setAnswer] = useState('')

    /* fetches the data from api surveys:ID*/
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:81/api/surveys/${id}`);
            const data = await result.json();
            setSurvey(data)
        };
        fetchData();
    }, []);

    async function fetchAnswers(questionId) {
        const result = await fetch(`http://localhost:81/api/filled_surveys/${questionId}`);
        const data = await result.json();
        setAnswer(data)
        setShowAnswer(true)
    }

    function ShowAnswers() {
        return (
            <>
                <table className='fetchedanswers_table'>
                    <tbody>
                        <tr>
                            <th>Antwoorden</th>
                            <th>Tijd</th>
                            <th>UID</th>
                        </tr>
                        {answer && answer.map((item, index) =>
                            <tr key={index}>
                                <td>
                                    <span>{item.answer}</span>
                                </td>
                                <td>
                                    <span>{item.date_answered}</span>
                                </td>
                                <td>
                                    <span>{item.User_ID}</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>
        )
    }

    return (
        <>
            <div className='surveyquestion_container'>
                <div className='boxx1'></div>
                <div className='boxx2'>
                    <table className='surveyquestion_table'>
                        <tbody>
                            <tr>
                                <th>Vraag</th>
                                <th>Type</th>
                            </tr>
                            {
                                survey && survey?.map(item => (
                                    <tr key={item.Survey_ID}>
                                        <td className='question__grey' onClick={() => fetchAnswers(item.Question_ID)}>
                                            <span>{item.open_question}</span>
                                            <span>{item.multi_question}</span>
                                        </td>
                                        <td> {(item.open_question !== null) ?
                                            <span>Open</span>
                                            : <span>Multiple Choice</span>
                                        }
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className='boxx3'>
                    <div className='fetchanswers_box'>
                        {showAnswer &&
                            <ShowAnswers />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SurveyQuestions