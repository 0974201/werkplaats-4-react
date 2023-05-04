import './survey.css'
import React from "react";

function OpenQuestion({ question }) {
    return (
        <div key={question.id}>
            <h3>{question.question}</h3>
            <textarea maxLength={250} />
        </div>
    )
}

function MultipleChoiceQuestion({ question }) {
    return (
        <div key={question.id}>
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

function Question({ questions }) {
    const questionList = questions.map(question => {
        switch (question.type) {
            case 'MultipleChoice':
                return (
                    <MultipleChoiceQuestion key={question.id} question={question} />
                )
            case 'Open':
                return (
                    <OpenQuestion key={question.id} question={question} />
                )
            default:
                console.log("Wrong type")
        }
    }
    )
    return (
        <>
            {questionList}
        </>
    )
}

export default function Survey2({ questionsArray }) {
    return (
        <div className={"survey"}>
            <Question questions={questionsArray} />
        </div>
    )
}