import React from "react";
import { useState } from "react";
import Survey2 from '../survey/survey'
import './creat_survey.css'

let nextOrder = 0

export default function CreateSurvey() {
    const [questionArray, setQuestionArray] = useState([])
    console.log(questionArray)

    function ReplaceValue(index, value) {
        const newArray = questionArray.map((question, i) => {
            if (i === index) {
                question.question = value
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
        const questionToMove = array[fromIndex]
        const newArray = [
            ...array.slice(0, toIndex),
            questionToMove,
            ...array.slice(toIndex,fromIndex),
            ...array.slice(fromIndex + 1)
        ]
        setQuestionArray(newArray)
    }

    function onAddOpenQuestion() {
        setQuestionArray([...questionArray, {type: "Open", id:nextOrder++, question: "empty",options: null, order: null}])
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
        <>
            <div className={'container'}>
                <div className={'create'}>
                {questionArray.map((question, i) => (
                        <div key={i}>

                            <h3>Vraag {i + 1}</h3>
                            <button onClick={() => ChangeOrder(questionArray, i, i-1)}>Up</button>
                            <button onClick={() => ChangeOrder(questionArray, i, i+1)}>Down</button>
                            <input
                                value={questionArray[i].question}
                                onChange={e => ReplaceValue(i, e.target.value)}
                            />
                            <button onClick={() => (
                                setQuestionArray(questionArray.filter(question =>
                                question.id !== questionArray[i].id))
                            )}>X</button>
                        </div>
                ))}

                <button onClick={onAddOpenQuestion}>Maak open vraag</button>
                </div>

                <Preview />
            </div>


        </>
    )
}