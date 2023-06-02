import './survey.css'
import React, {useState} from "react";
import Progressbar from "../universal/progressbar";
import {useParams} from "react-router-dom";
import Group from "../universal/GroupBy";

export default function Survey({surveyArray}) {
    const { id } = useParams();
    const [answeredArray, setAnsweredArray] = useState(onLoadSurvey())
    const [questionShown, setQuestionShow] = useState(onLoadQuestionShown())
    const [testArray, setTestArray] = useState(fetchSurvey)
    const [testQuest, setTestQuest] = useState(fetchQuestion)

    console.log(answeredArray)
    console.log(testArray)
    console.log(testQuest)

    sessionStorage.setItem("survey", JSON.stringify(answeredArray))
    sessionStorage.setItem("questionShown", JSON.stringify(questionShown))



    async function fetchSurvey() {
        const result = await fetch('http://localhost:81/api/getSurvey/' + id)
        const data = await result.json()
        console.log(data)
        setTestArray(data)
    }

    async function fetchQuestion() {
        const result = await fetch('http://localhost:81/api/getSurveyQuestions/' + id)
        const data = await result.json()
        console.log(data)
        setTestQuest(data)
    }

    async function fetchOption() {
        const result = await fetch('http://localhost:81/api/getSurveyOptions/' + id)
        const data = await result.json()
        console.log(data)

        const grouped = Group(data)


        console.log(Object.keys(grouped))

        const newQuestionArray = testQuest.map(question => {
            if (question.Multiple_Choice_ID !== null && question.Multiple_Choice_ID === Object.keys(grouped)) {
                return {...question}

            } else {
                return {...question, options: ''}
            }
        })
        console.log(newQuestionArray)
        // setTestArray({ ...testArray.questions, options: data })
    }


    function onLoadSurvey() {
        if (JSON.parse(sessionStorage.getItem("survey")) === null) {
            return surveyArray.questions.map(question => {return {...question, answer: ''}})
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
        answeredArray.map(question => {
            if (question.answer !== '') {
                amountAnswerd++
            }
        })
        return amountAnswerd
    }

    const questionList = answeredArray.map((question, questionIndex) => {
            switch (question.type) {
                case 'MultipleChoice':
                    return (
                        <div>
                            <h3>{question.question}</h3>
                            <ul>
                                {question.options.map((option, optionIndex) =>
                                    <li key={optionIndex} onChange={e => replaceAnswer(questionIndex, e.target.value)}>
                                        <label>
                                            <input type={"radio"} value={option} name={"question" + question.id} defaultChecked={question.answer === option} />
                                            {option}
                                        </label>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                case 'Open':
                    return (
                        <div>
                            <h3>{question.question}</h3>
                            <textarea
                                maxLength={250}
                                value={answeredArray[questionIndex].answer}
                                onChange={e => replaceAnswer(questionIndex, e.target.value)}
                            />
                        </div>
                    )
                default:
                    console.log("Wrong type")
                    return (
                        <div><h3>Wrong type</h3></div>
                    )
            }
        }
    )

    return (
            <div className={"survey"}>
                <button onClick={fetchSurvey}>knop</button>
                <button onClick={fetchQuestion}>knop</button>
                <button onClick={fetchOption}>knop</button>
                <Progressbar checkedAnswerd={checkAnswerd()} amountQuestion={questionList.length} />
                <span>vragen beantwoord: {checkAnswerd()}/{questionList.length}</span>
                <h1>{surveyArray.title}</h1>
                {questionShown <= 0 &&
                    <p>{surveyArray.description}</p>
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