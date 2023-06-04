import './survey.css'
import React, {useState} from "react";
import Progressbar from "../universal/progressbar";
import {saveToDB} from "../universal/manipulateDB";

export default function Survey({surveyArray}) {
    const urlStart = window.location.pathname.split('/')
    const [answeredArray, setAnsweredArray] = useState(onLoadSurvey)
    const [questionShown, setQuestionShow] = useState(onLoadQuestionShown())


    console.log(urlStart)


    console.log(answeredArray)

    if (urlStart[1] === 'survey'){
        sessionStorage.setItem("survey", JSON.stringify(answeredArray))
    }
    sessionStorage.setItem("questionShown", JSON.stringify(questionShown))

    function onLoadSurvey() {
        if (urlStart[1] === 'survey') {
            if (JSON.parse(sessionStorage.getItem("survey")) === null) {
                return surveyArray
            } else {
                return JSON.parse(sessionStorage.getItem("survey"))
            }
        } else if (urlStart[1] === 'create') {
            return JSON.parse(sessionStorage.getItem("createSurvey"))
        }

    }



    function onLoadQuestionShown() {
        if (JSON.parse(sessionStorage.getItem("questionShown")) === null || urlStart[1] === 'create') {
            return 0
        } else {
            const questionShown = JSON.parse(sessionStorage.getItem("questionShown"))
            return(questionShown)
        }
    }

    function replaceAnswer(questionIndex, value) {
        const inBetweenArray = answeredArray.questions.map((question, i) => {
            if (i === questionIndex) {
                question.answer = value
                return question
            } else {
                return question
            }
        })
        setAnsweredArray({...answeredArray, questions: inBetweenArray})
    }

    function checkAnswered() {
        let amountAnswered = 0
        answeredArray.questions.map(question => {
            if (question.answer !== '') {
                amountAnswered++
            }
        })
        return amountAnswered
    }

    function pageCheckMulti(question) {
        if (urlStart[1] === 'survey') {
            return question.multi_question !== null;
        }else if(urlStart[1] === 'create') {
            return question.type === 'MultipleChoice';
        }
    }

    function pageCheckOpen(question) {
        if (urlStart[1] === 'survey') {
            return question.open_question !== null;
        }else if(urlStart[1] === 'create') {
            return question.type === 'Open';
        }
    }

    const questionList = answeredArray.questions.map((question, questionIndex) => {
        console.log(question)
            if (pageCheckMulti(question)) {

                return (
                    <div>
                        <h3>{question.multi_question}</h3>
                        <ul>
                            {question.options.map((option, optionIndex) =>
                                <li key={optionIndex} onChange={e => replaceAnswer(questionIndex, e.target.value)}>
                                    <label>
                                        <input
                                            type={"radio"}
                                            value={option}
                                            name={"question" + questionIndex}
                                            checked={question.answer === option}

                                        />
                                        {option}
                                    </label>
                                </li>
                            )}
                        </ul>
                    </div>
                )
            } else if(pageCheckOpen(question)) {
                return (
                    <div>
                        <h3>{question.open_question}</h3>
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
                {urlStart[1] === 'survey' &&
                    <>
                        <Progressbar checkedAnswerd={checkAnswered()} amountQuestion={questionList.length} />
                        <span>vragen beantwoord: {checkAnswered()}/{questionList.length}</span>
                    </>

                }
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
                    {questionShown < answeredArray.questions.length &&
                        <button className={'next'} onClick={() => setQuestionShow(questionShown+1)}>Volgende</button>
                    }
                    {checkAnswered() === questionList.length && urlStart[1] === 'survey' &&
                        <button className={'submit'} onClick={() => {
                            saveToDB(answeredArray, 'saveAnswers')
                            sessionStorage.removeItem("survey")
                        }}>Lever in</button>
                    }
                </div>
            </div>
    )
}