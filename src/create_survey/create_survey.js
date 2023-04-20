import React from "react";
import { useState } from "react";
import './creat_survey.css'

let nextOrder = 0

export default function CreateSurvey() {
    const [questionList, setQuestionList] = useState([])
    const [questionArray, setQuestionArray] = useState([])

    function CreateOpen() {
        const [question, setQuestion] = useState('')
        const [questionArray2, setQuestionArray2] = useState([])

        return (
            <div key={nextOrder}>
                <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                />
                <button onClick={() => {
                    setQuestionArray2(
                        [
                            ...questionArray2,
                            question
                        ])
                    console.log(questionArray2)
                }
                }>add</button>
                {/*<button onClick={}>X</button>*/}

            </div>
        )
    }

    const onAddOpenQuestion = event => {
        setQuestionList(questionList.concat(<CreateOpen />))
        setQuestionArray([...questionArray, {question: '', order: nextOrder++}])
        console.log(questionArray)
    }

    return (
        <div className={'container'}>
            {questionList}
            <button onClick={onAddOpenQuestion}>Maak open vraag</button>
        </div>
    )
}