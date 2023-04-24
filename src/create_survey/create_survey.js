import React from "react";
import { useState } from "react";
import Survey2 from '../survey/survey'
import './creat_survey.css'

let nextOrder = 0

export default function CreateSurvey() {
    const [questionArray, setQuestionArray] = useState([])
    console.log(questionArray)

    function ReplaceQuestion(questionIndex, value) {
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

    function ReplaceOption(questionIndex, optionIndex, value) {
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

    function ChangeOrder(array, fromIndex, toIndex) {
        console.log(fromIndex)
        console.log(toIndex)
        console.log(array.length)
        const questionToMove = array[fromIndex]
        const questionToShove = array[toIndex]

        if (fromIndex > toIndex && fromIndex !== 0) {
            const newArray = [
                ...array.slice(0, toIndex),
                questionToMove,
                questionToShove,
                ...array.slice(fromIndex + 1)
            ]
            setQuestionArray(newArray)
        } else if (fromIndex < toIndex && toIndex < array.length) {
            const newArray = [
                ...array.slice(0, fromIndex),
                questionToShove,
                questionToMove,
                ...array.slice(toIndex + 1)
            ]
            setQuestionArray(newArray)
        }
    }

    function onAddOpenQuestion() {
        setQuestionArray([...questionArray, {type: "Open", id:nextOrder++, question: 'maak vraag',options: null, order: null}])
    }

    function onAddMultipleChoiceQuestion() {
        setQuestionArray([...questionArray, {type: "MultipleChoice", id:nextOrder++, question: 'maak vraag',options: ['maak optie'], order: null}])
    }

    function onAddOption(questionIndex) {
        console.log(questionArray)
        console.log(questionIndex)
        const newArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options = [...question.options, 'maak optie']
                return question
            } else {
                return question
            }
        })
        console.log(newArray)
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
                        <button onClick={() => ChangeOrder(questionArray, questionIndex, questionIndex-1)}>Up</button>
                        <button onClick={() => ChangeOrder(questionArray, questionIndex, questionIndex+1)}>Down</button>
                        <input
                            placeholder={'maak vraag'}
                            value={questionArray[questionIndex].question}
                            onChange={e => ReplaceQuestion(questionIndex, e.target.value)}
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
                                            <input
                                                placeholder={'maak optie'}
                                                value={option}
                                                onChange={e => ReplaceOption(questionIndex,optionIndex, e.target.value)}
                                            />
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
            </div>
            <Preview />
        </div>
    )
}