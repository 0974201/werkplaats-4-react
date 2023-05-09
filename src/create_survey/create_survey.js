import React from "react";
import { useState } from "react";
import Survey2 from '../survey/survey'
import './creat_survey.css'
import {questions} from "../index";

let nextOrder = 0

export default function CreateSurvey() {
    const [questionArray, setQuestionArray] = useState([])
    const [buttonState, setButtonState] = useState(false)
    console.log(questionArray)

    function addToArray(inBetweenArray) {
        const newArray = inBetweenArray.map((question, questionIndex) => {
            return {...question, id: questionIndex}
        })
        setQuestionArray(newArray)
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

    function switchQuestions(array, fromIndex, toIndex) {
            const inBetweenArray = switchAround(array, fromIndex, toIndex)
            addToArray(inBetweenArray)
        }

    function switchOptions(list, fromIndex, toIndex, questionId) {
        const inBetweenArray = questionArray.map(question => {
            if (question.id === questionId) {
                return { ...question, options: switchAround(list, fromIndex, toIndex)}
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function switchAround(array, fromIndex, toIndex) {
        const questionToMove = array[fromIndex]
        const questionToShove = array[toIndex]

        if (fromIndex > toIndex && fromIndex !== 0) {
            return [
                ...array.slice(0, toIndex),
                questionToMove,
                questionToShove,
                ...array.slice(fromIndex + 1)
            ]
        } else if (fromIndex < toIndex && toIndex < array.length) {
            return [
                ...array.slice(0, fromIndex),
                questionToShove,
                questionToMove,
                ...array.slice(toIndex + 1)
            ]
        } else {
            return array
        }
    }

    function addOpenQuestion() {
        const inBetweenArray = [...questionArray, {type: "Open", id:nextOrder++, question: 'maak open vraag',options: null, order: null}]
        addToArray(inBetweenArray)
    }

    function addMultipleChoiceQuestion() {
        const inBetweenArray = [...questionArray, {type: "MultipleChoice", id:nextOrder++, question: 'maak multiple choice vraag',options: ['1', '2'], order: null}]
        addToArray(inBetweenArray)
    }

    function addExistingQuestion(question) {
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
                return { ...question, options: newOptions}
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function Preview() {
        if (questionArray.length > 0) {
            return (
                <div>
                    <h2>Preview</h2>
                    <Survey2 questionsArray={questionArray} />
                </div>
            )
        }
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
                                    <td><button onClick={() => addExistingQuestion(question)}>Selecteer</button></td>
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
        <div className={'container'}>
            <div className={'create'}>
                {questionArray.map((question, questionIndex) => (
                    <div key={questionIndex}>
                        <h3>Vraag {questionIndex + 1}</h3>
                        <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex-1)}>Up</button>
                        <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex+1)}>Down</button>
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
                        {question.type === 'MultipleChoice' &&
                            <>
                                <ul>
                                    {question.options.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                            <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex-1, question.id)}>Up</button>
                                            <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex+1, question.id)}>Down</button>
                                            <input
                                                placeholder={'maak optie'}
                                                value={option}
                                                onChange={e => replaceOption(questionIndex,optionIndex, e.target.value)}
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
                <button onClick={addOpenQuestion}>Maak open vraag</button>
                <button onClick={addMultipleChoiceQuestion}>Maak multiple choice vraag</button>
                <button onClick={() => setButtonState(true)}>Kies bestaande vraag</button>
            </div>
            {/*<Preview />*/}
            {buttonState &&
                <PopUp />
            }
        </div>
    )
}