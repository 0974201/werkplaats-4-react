import './survey.css'
import React, {useEffect, useState} from "react";
import Progressbar from "../universal/progressbar";

export default function Survey({surveyArray}) {

    const [answeredArray, setAnsweredArray] = useState(onLoadSurvey)
    const [questionShown, setQuestionShow] = useState(onLoadQuestionShown())


    console.log(answeredArray)

    sessionStorage.setItem("survey", JSON.stringify(answeredArray))
    sessionStorage.setItem("questionShown", JSON.stringify(questionShown))

    function onLoadSurvey() {
        if (JSON.parse(sessionStorage.getItem("survey")) === null) {
            return surveyArray
        } else {
            const arrayToSurvey = JSON.parse(sessionStorage.getItem("survey"))
            return(arrayToSurvey)
        }
    }



    function onLoadQuestionShown() {
        if (JSON.parse(sessionStorage.getItem("questionShown")) === null) {
            return 0
        } else {
            const questionShown = JSON.parse(sessionStorage.getItem("questionShown"))
            return(questionShown)
        }
    }

    function replaceAnswer(questionIndex, value) {
        const inBetweenArray = answeredArray.map((question, i) => {
            if (i === questionIndex) {
                question.answer = value
                return question
            } else {
                return question
            }
        })
        setAnsweredArray(inBetweenArray)
    }

    function checkAnswerd() {
        let amountAnswerd = 0
        answeredArray.questions.map(question => {
            if (question.answer !== '') {
                amountAnswerd++
            }
        })
        return amountAnswerd
    }

    const questionList = answeredArray.questions.map((question, questionIndex) => {
            if (question.multi_question !== null) {
                return (
                    <div>
                        <h3>{question.question}</h3>
                        <ul>
                            {question.options.map((option, optionIndex) =>
                                <li key={optionIndex} onChange={e => replaceAnswer(questionIndex, e.target.value)}>
                                    <label>
                                        <input type={"radio"} value={option} name={"question" + question.id}
                                               defaultChecked={question.answer === option}/>
                                        {option}
                                    </label>
                                </li>
                            )}
                        </ul>
                    </div>
                )
            } else if(question.open_question !== null) {
                return (
                    <div>
                        <h3>{question.question}</h3>
                        <textarea
                            maxLength={250}
                            value={answeredArray.questions[questionIndex].answer}
                            onChange={e => replaceAnswer(questionIndex, e.target.value)}
                        />
                    </div>
                )
            } else {
                console.log("Wrong type")
                return (
                    <div><h3>Wrong type</h3></div>
                )
            }
        }
    )

    return (
            <div className={"survey"}>
                <Progressbar checkedAnswerd={checkAnswerd()} amountQuestion={questionList.length} />
                <span>vragen beantwoord: {checkAnswerd()}/{questionList.length}</span>
                <h1>{answeredArray.title}</h1>
                {questionShown <= 0 &&
                    <p>{answeredArray.description}</p>
                }
                {questionShown > 0 &&
                    <>
                        <h3>Vraag {questionShown}/{questionList.length}</h3>
                        {questionList[questionShown-1]}
                    </>
                }

                <div className={'navigation'}>
                    {questionShown > 0 &&
                        <button className={'prev'} onClick={() => setQuestionShow(questionShown-1)}>Vorige</button>
                    }
                    {questionShown < answeredArray.length &&
                        <button className={'next'} onClick={() => setQuestionShow(questionShown+1)}>Volgende</button>
                    }
                </div>
            </div>
    )
}