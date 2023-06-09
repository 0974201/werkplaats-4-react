import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import Survey from '../survey/survey'
import SwitchAround from "../universal/switch_around";
import './creat_survey.css'
import { questions } from "../index";
import { saveToDB } from "../universal/manipulateDB";

let nextOrder = 0

export default function CreateSurvey() {
    const [questionArray, setQuestionArray] = useState(onLoadArray())
    const [surveyArray, setSurveyArray] = useState(onLoadSurvey())
    const [buttonState, setButtonState] = useState(false)

    const navigate = useNavigate();
    const [getSession, setSession] = useState();
    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if(user){
            setSession(user);
        }
    })

    if(!getSession){
        navigate('/login')
    }

    console.log(surveyArray)

    sessionStorage.setItem("createSurvey", JSON.stringify(surveyArray))

    function onLoadSurvey() {
        if (JSON.parse(sessionStorage.getItem("createSurvey")) === null) {
            const arrayToSurvey = {
                title: "Titel",
                description: "Beschrijving",
                openDate: "",
                closeDate: "",
                questions: questionArray,
                anonymity: true
            }
            return (arrayToSurvey)
        } else {
            const arrayToSurvey = JSON.parse(sessionStorage.getItem("createSurvey"))
            return (arrayToSurvey)
        }
    }

    function onLoadArray() {
        if (JSON.parse(sessionStorage.getItem("createSurvey")) === null) {
            const arrayToSurvey = [{ type: "Open", id: nextOrder++, question: 'maak open vraag', options: null, order: null }]
            return (arrayToSurvey)
        } else {
            const arrayToSurvey = JSON.parse(sessionStorage.getItem("createSurvey"))
            return (arrayToSurvey.questions)
        }
    }

    function addToArray(inBetweenArray) {
        const newArray = inBetweenArray.map((question, questionIndex) => {
            return { ...question, id: questionIndex }
        })
        setQuestionArray(newArray)
        setSurveyArray({ ...surveyArray, questions: newArray })
    }

    function replaceQuestion(questionIndex, value) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.question = value
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function replaceOption(questionIndex, optionIndex, value) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options[optionIndex] = value
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function replaceSurveyItem(item, value) {
        switch (item) {
            case 'title':
                setSurveyArray({ ...surveyArray, title: value })
                break
            case 'description':
                setSurveyArray({ ...surveyArray, description: value })
                break
            case 'openDate':
                setSurveyArray({ ...surveyArray, openDate: value })
                break
            case 'closeDate':
                setSurveyArray({ ...surveyArray, closeDate: value })
                break
            case 'anonymity':
                if (value === true) {
                    const inBetweenArray = { ...surveyArray, anonymity: false }
                    setSurveyArray(inBetweenArray)
                } else {
                    const inBetweenArray = { ...surveyArray, anonymity: true }
                    setSurveyArray(inBetweenArray)
                }
                break
            default:
                console.log(item + "is not a valid input")
        }
    }

    function switchQuestions(array, fromIndex, toIndex) {
        const inBetweenArray = SwitchAround(array, fromIndex, toIndex)
        addToArray(inBetweenArray)
    }

    function switchOptions(list, fromIndex, toIndex, questionId) {
        const inBetweenArray = questionArray.map(question => {
            if (question.id === questionId) {
                return { ...question, options: SwitchAround(list, fromIndex, toIndex) }
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function addQuestion(question) {
        const inBetweenArray = [...questionArray, question]
        addToArray(inBetweenArray)
    }

    function addOption(questionIndex) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options = [...question.options, 'maak optie']
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function deleteOptionInQuestion(questionId, optionIndex) {
        const inBetweenArray = questionArray.map(question => {
            if (question.id === questionId && question.options.length > 2) {
                const newOptions = question.options.filter((value, index) => index !== optionIndex)
                return { ...question, options: newOptions }
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function AddButtons() {
        return (
            <div className={'create'}>
                <h2>Selecteer vraag type</h2>
                <button onClick={() => addQuestion({ type: "Open", id: nextOrder++, question: 'maak open vraag', options: null, order: null })}>Maak open vraag</button>
                <button onClick={() => addQuestion({ type: "MultipleChoice", id: nextOrder++, question: 'maak multiple choice vraag', options: ['1', '2'], order: null })}>Maak multiple choice vraag</button>
                <button onClick={() => setButtonState(true)}>Kies bestaande vraag</button>
            </div>
        )
    }

    function Preview() {
        return (
            <div className={'create'}>
                <h2>Preview</h2>
                {questionArray.length > 0 &&
                    <Survey surveyArray={surveyArray} />
                }
            </div>
        )
    }

    function PopUp() {
        return (
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
                                        <td><button onClick={() => addQuestion(question)}>Selecteer</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={'close'}>
                        <button onClick={() => setButtonState(false)}>X</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'container__create_survey'}>
            <div className={'box'}>
                <div className={'create'}>
                    <h2>Geef extra informatie</h2>
                    <label> Titel
                        <input
                            placeholder={'Titel'}
                            value={surveyArray.title}
                            onChange={e => replaceSurveyItem('title', e.target.value)}
                        />
                    </label>
                    <label>Begin tijd
                        <input
                            type={'date'}
                            value={surveyArray.openDate}
                            onChange={e => replaceSurveyItem('openDate', e.target.value)}
                        />
                    </label>
                    <label>Eind tijd (optioneel)
                        <input
                            type={'date'}
                            value={surveyArray.closeDate}
                            onChange={e => replaceSurveyItem('closeDate', e.target.value)}
                        />
                    </label>
                    <label>Beschrijving
                        <textarea
                            placeholder={'Beschrijving'}
                            value={surveyArray.description}
                            onChange={e => replaceSurveyItem('description', e.target.value)}
                        ></textarea>
                    </label>

                    <label>Deze enquête kan anoniem beantwoord worden
                        <input
                            type={'checkbox'}
                            onChange={e => replaceSurveyItem('anonymity', e.target.checked)}
                        />
                    </label>
                    <button onClick={() => sessionStorage.removeItem("createSurvey")}>reset</button>
                </div>
                <AddButtons />
            </div>

            <div className={'box'}>
                <div className={'create'}>
                    {questionArray.map((question, questionIndex) => (
                        <div key={questionIndex} className={'question'}>
                            <h3>Vraag {questionIndex + 1}</h3>
                            <div className={'question_input'}>
                                <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex - 1)}>Up</button>
                                <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex + 1)}>Down</button>
                                <input
                                    placeholder={'maak vraag'}
                                    value={questionArray[questionIndex].question}
                                    onChange={e => replaceQuestion(questionIndex, e.target.value)}
                                />

                                <button onClick={() => (
                                    setQuestionArray(questionArray.filter(question =>
                                        question.id !== questionArray[questionIndex].id)
                                    )
                                )}>X</button>
                            </div>

                            {question.type === 'MultipleChoice' &&
                                <>
                                    <ul>
                                        {question.options.map((option, optionIndex) => (
                                            <li key={optionIndex}>
                                                <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex - 1, question.id)}>Up</button>
                                                <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex + 1, question.id)}>Down</button>
                                                <input
                                                    placeholder={'maak optie'}
                                                    maxLength={250}
                                                    value={option}
                                                    onChange={e => replaceOption(questionIndex, optionIndex, e.target.value)}
                                                />
                                                <button onClick={() => (deleteOptionInQuestion(question.id, optionIndex))

                                                }>X</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => addOption(questionIndex)}>Maak multiple choice optie</button>
                                </>
                            }
                        </div>
                    ))}
                </div>
                <div className={'create'}>
                    <button onClick={() => saveToDB(surveyArray, 'saveNewSurvey')}>Opslaan</button>
                </div>
            </div>

            <div className={'box'}>
                <Preview />
            </div>
            {buttonState &&
                <PopUp />
            }
        </div>
    )
}