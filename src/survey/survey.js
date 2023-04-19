import './survey.css'
import React from "react";

class Question extends React.Component {
    constructor(props) {
        super(props)
    }

    OpenQuestion({question}) {
        return (
            <div key={question.id}>
                <h3>De open vraag</h3>
                <input/>
            </div>
        )
    }

    MultipleChoiceQuestion({question}) {
        const optionsList = question.options.map(option =>
            <label key={question.id}>
                <input type={"radio"} value={option} name={"question"+question.id}/>
                {option}
            </label>
        )
        return (
            <div>
                {optionsList}
            </div>
        )
    }

    render() {
        const questionList = this.props.questions.map(question =>
            {
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
}

export default function Survey() {
    let questions = [
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
        }
    ]

    return (
        <div className={"survey"}>
            <Question questions={questions} />
        </div>
    )
}
