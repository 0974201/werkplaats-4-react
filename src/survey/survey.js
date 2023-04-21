import './survey.css'
import React from "react";

function OpenQuestion({ question }) {
    return (
        <div key={question.id}>
            <h3>{question.question}</h3>
            <input />
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

export let questions = [
    {
        type: "MultipleChoice",
        id: 1,
        question: "Wat is de naam van je vis?",
        options: ['Bubbles', 'John', 'Speedy', 'The drowned one']
    },
    {
        type: "Open",
        id: 2,
        question: "Hoe heet je huis spin?",
        options: null
    },
    {
        type: "MultipleChoice",
        id: 3,
        question: "Wat is de naam van je kat?",
        options: ['Scratch', 'Tiger', 'Spot', 'Nigel']
    },
    {
        type: "Open",
        id: 4,
        question: "Van welke saus hou je?",
        options: null
    }
]

export default function Survey2() {

    return (
        <div className={"survey"}>
            <Question questions={questions} />
        </div>
    )
}
