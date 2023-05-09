import './survey.css'
import React, {useState} from "react";

export default function Survey2({questionsArray}) {
    const [answeredArray, setAnsweredArray] = useState(questionsArray.map(question => {return {...question, answer: 'hi'}}))
    const [questionShown, setQuestionShow] = useState(0)
    console.log(answeredArray)

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

    function OpenQuestion({question, questionIndex}) {
        console.log(question)
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
    }

    function MultipleChoiceQuestion({question}) {
        return (
            <div>
                <h3>{question.question}</h3>
                <ul>
                    {question.options.map((option, optionIndex) =>
                        <li key={optionIndex}>
                            <label>
                                <input type={"radio"} value={option} name={"question" + question.id} />
                                {option}
                            </label>
                        </li>
                    )}
                </ul>
            </div>
        )
    }

    function Question() {

        console.log(questionShown)
        console.log(answeredArray.length)
        const questionList = answeredArray.map((question, questionIndex) => {
                switch (question.type) {
                    case 'MultipleChoice':
                        return (
                            <MultipleChoiceQuestion key={questionIndex} question={question} questionIndex={questionIndex} />
                        )
                    case 'Open':
                        return (
                            <OpenQuestion key={questionIndex} question={question} questionIndex={questionIndex} />
                        )
                    default:
                        console.log("Wrong type")
                }
            }
        )
        return (
            <>
                <h3>Vraag {questionShown+1}/{questionList.length}</h3>
                {questionList[questionShown]}
                <div className={'navigation'}>
                    {questionShown > 0 &&
                        <button className={'prev'} onClick={() => setQuestionShow(questionShown-1)}>Vorige vraag</button>
                    }
                    {questionShown+1 < answeredArray.length &&
                        <button className={'next'} onClick={() => setQuestionShow(questionShown+1)}>Volgende vraag</button>
                    }
                </div>


            </>
        )
    }

    return (
        <div className={"survey"}>
            <Question />
        </div>
    )
}