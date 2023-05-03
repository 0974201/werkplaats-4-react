import React from "react";
import { useState } from "react";
import Survey2 from '../survey/survey'
import PopUp from "../pop_up/pop_up";
import './creat_survey.css'

let nextOrder = 0

export default function CreateSurvey() {
    const [questionArray, setQuestionArray] = useState([])
    console.log(questionArray)

    function replaceQuestion(questionIndex, value) {
        const newArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.question = value
                return question
            } else {
                return question
            }
        })
        setQuestionArray(newArray)
    }

    function replaceOption(questionIndex, optionIndex, value) {
        const newArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options[optionIndex] = value
                return question
            } else {
                return question
            }
        })
        setQuestionArray(newArray)
    }

    function switchQuestions(array, fromIndex, toIndex) {
            const newArray = switchAround(array, fromIndex, toIndex)
            setQuestionArray(newArray)
        }

    function switchOptions(list, fromIndex, toIndex, questionId) {
        const newArray = questionArray.map(question => {
            if (question.id === questionId) {
                return { ...question, options: switchAround(list, fromIndex, toIndex)}
            } else {
                return question
            }
        })
        setQuestionArray(newArray)
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

    function onAddOpenQuestion() {
        setQuestionArray([...questionArray, {type: "Open", id:nextOrder++, question: 'maak open vraag',options: null, order: null}])
    }

    function onAddMultipleChoiceQuestion() {
        setQuestionArray([...questionArray, {type: "MultipleChoice", id:nextOrder++, question: 'maak multiple choice vraag',options: ['1', '2'], order: null}])
    }

    function onAddOption(questionIndex) {
        const newArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options = [...question.options, 'maak optie']
                return question
            } else {
                return question
            }
        })
        setQuestionArray(newArray)
    }

    function deleteOptionInQuestion(questionId, optionIndex) {
        const newArray = questionArray.map(question => {
            if (question.id === questionId && question.options.length > 2) {
                const newOptions = question.options.filter((value, index) => index !== optionIndex)
                return { ...question, options: newOptions}
            } else {
                return question
            }

        })
        setQuestionArray(newArray)
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
                                        <li>
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
                                <button onClick={() => onAddOption(questionIndex)}>Maak multiple choice optie</button>
                            </>
                        }
                    </div>
                ))}
                <button onClick={onAddOpenQuestion}>Maak open vraag</button>
                <button onClick={onAddMultipleChoiceQuestion}>Maak multiple choice vraag</button>
                <PopUp />
            </div>
            <Preview />
        </div>
    )
}