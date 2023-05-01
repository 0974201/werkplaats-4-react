import React, { useState } from 'react';
import './questions.css';
import { useParams } from 'react-router-dom';
import { questions } from '../index.js'


export default function ChangeQuestion({ question }) {
    const [value, setValue] = useState('')
    const { id } = useParams();
    const [questionlist, setQuestion] = useState(questions);
    const [option, setSelectedOption] = useState(questions);
    console.log(question[id].question)
    console.log(id)
    console.log(question)
    console.log(question[id].type)
    console.log('heyy dit zijn ' + question[id].options)

    const handleModify = (id, newQuestion) => {
        console.log('dit woss ' + id, newQuestion);
        console.log(value)
        let updatedQuestion = questionlist.map(question => {
            if (question.id === id) {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        console.log('dit is ' + setQuestion)
        setQuestion(updatedQuestion);
        question[id].question = newQuestion;
    };

    console.log('options' + question[id].options)
    console.log('option' + question[id].option)
    /* Checks for whether the question type is Open or Multiple Choice */
    return (
        <div>
            {question[id].type === 'Open' &&
                <>
                    <h1> Change Question {id}</h1>
                    <p>{questionlist[id].question}</p>
                    <input type='text' className='input' value={value} onChange={e => setValue(e.target.value)}></input>
                    <button className='button' onClick={() => handleModify(id, value)}>Modify</button>
                </>
            }
            {question[id].type === 'MultipleChoice' &&
                <>
                    <h1> Change Multiple Choice Question {id}</h1>
                    <p>{questionlist[id].question}</p>
                    {questionlist[id].options.map((option, index) => {
                        return (
                            <div key={index}>
                                <input
                                    type='radio'
                                    name='options'
                                    value={option}
                                    onChange={(event) => setSelectedOption(event.target.value)}
                                />
                                <label>{option}</label>
                            </div>
                        );
                    })}
                    <input type='text' className='input' value={value} onChange={e => setValue(e.target.value)}></input>
                    <button className='button' onClick={() => handleModify(id, value)}>Modify</button>
                    <button className='button'>Save</button>
                </>
            }

        </div>
    )
}
