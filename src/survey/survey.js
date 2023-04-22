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
    const optionsList = question.options.map(option =>
        <label key={question.id}>
            <input type={"radio"} value={option} name={"question" + question.id} />
            {option}
        </label>
    )
    return (
        <div>
            <h3>{question.question}</h3>
            {optionsList}
        </div>
    )
}

function Question({ questions }) {
    console.log(questions)
    const questionList = questions.map(question => {
        switch (question.type) {
            case 'MultipleChoice':
                return (
                    <MultipleChoiceQuestion question={question} />
                )
            case 'Open':
                return (
                    <OpenQuestion question={question} />
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
    console.log(questionsArray)

    return (
        <div className={"survey"}>
            <Question questions={questionsArray} />
        </div>
    )
}
