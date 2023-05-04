import React, {useState} from "react";
import {questions} from "../index";
import './pop_up.css'

export default function PopUp({surveyArray}, buttonState) {

    const [questionArray, setQuestionArray] = useState(surveyArray)
    console.log(surveyArray)
    console.log(questionArray)
    return (
        <div>

            {buttonState && (
                <div className={'pop_up_container'}>
                    <div className={'pop_up'}>
                        <div className={'pop_up_content'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vraag</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question) => (
                                        <tr key={question.id}>
                                            <td>{question.question}</td>
                                            <td>{question.type}</td>
                                            <td><button onClick={() => setQuestionArray([...questionArray, question])}>Selecteer</button></td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                        {/*<div className={'close'}>*/}
                        {/*    <button onClick={() => setButtonState(false)}>X</button>*/}
                        {/*</div>*/}

                    </div>
                </div>

            )}
        </div>

    )
}