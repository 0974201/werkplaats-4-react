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

    function onAddOpenQuestion() {
        setQuestionArray([...questionArray, {type: "Open", id:nextOrder, question: "empty",options: null, order: nextOrder++}])
    }

    function Preview() {
        if (questionArray.length > 0) {
            return <Survey2 questionsArray={questionArray} />
        }
    }

    return (
        <>
            <div className={'container'}>
                <div className={'create'}>
                {questionArray.map((question, i) => (
                        <div key={i}>
                            <h3>Vraag {i + 1}</h3>
                            <input
                                onChange={e => ReplaceValue(i, e.target.value)}
                            />

                            {/*<button onClick={() => (*/}
                            {/*    setQuestionArray(questionArray.filter(question =>*/}
                            {/*    question.id !== questionArray.id))*/}
                            {/*)*/}

                            {/*}>X</button>*/}
                        </div>
                ))}

                <button onClick={onAddOpenQuestion}>Maak open vraag</button>
                </div>
                <Preview />
            </div>


        </>
    )
}