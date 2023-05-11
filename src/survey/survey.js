import './survey.css'
import React, {useState} from "react";

export default function Survey2({surveyArray}) {
    const [answeredArray, setAnsweredArray] = useState(surveyArray.questions.map(question => {return {...question, answer: 'hi'}}))
    const [questionShown, setQuestionShow] = useState(0)

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
                                            <input type={"radio"} value={option} name={"question" + question.id} checked={question.answer === option} />
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
            }
        }
    )

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
    return (
        <div className={"survey"}>
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