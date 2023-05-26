import React, { useState, useEffect } from 'react';
import './questions.css';
import { useParams, Link } from 'react-router-dom';
import { questions } from '../index.js'
import SwitchAround from '../universal/switch_around.js'
import { saveToDB } from '../universal/manipulateDB';


export default function ChangeQuestion({ question }) {
    // const [value, setValue] = useState('')
    // const [id, setId] = useState(question[id].id);
    const { id } = useParams();
    const [questionlist, setQuestion] = useState(questions);
    // const [selectedOption, setSelectedOption] = useState('');
    const [questionvalue, setQuestionValue] = useState(question[id].question);
    const [options, setOptions] = useState(question[id].options)
    const [message, setMessage] = useState('')

    console.log(question)
    console.log(options)
    console.log((question[id].id))
    function SaveQuestion() {
        const saveArray = {
            question: questionvalue,
            questionId: id,
            options: options,
            type: question[id].type,
        }
        saveToDB(saveArray, 'questions');
        setMessage('Vraag is succesvol opgeslagen!')
    }
    console.log(SaveQuestion)

    /* This is the Up and Down buttons that allow us to change the order of options.*/
    function switchOptions(list, fromIndex, toIndex) {
        const newList = SwitchAround(list, fromIndex, toIndex)
        setOptions(newList)
    }

    /* Changes the question to the value that is put in the textarea element */
    const handleModify = (id, newQuestion) => {
        let updatedQuestion = questionlist.map(question => {
            if (question.id === id, newQuestion !== '') {
                return { ...question, question: newQuestion };
            } else {
                return question;

            }
        });
        setQuestion(updatedQuestion)
        setMessage('Vraag is aangepast!')
    };

    /* Changes the option values of multiple choice questions */
    function replaceOptions(radioIndex, value) {
        const newOption = options.map((option, i) => {
            if (i === radioIndex) {
                option = value
                return option
            } else {
                return option
            }
        })
        setOptions(newOption)
    }

    console.log('dit is options' + options)
    /* Checks for whether the question type is Open or Multiple Choice depending on the id in the array. */
    function renderQuestion() {
        const question = questions[id];
        if (question.type === 'Open') {
            return (
                <>
                    <h1> Change Question {id}</h1>
                    <p><b>{questionvalue}</b></p>
                </>
            )
        } else if (question.type === 'MultipleChoice') {
            return (
                <div>
                    <h1>Change Multiple Choice Question {id}</h1>
                    <p><b>{questionvalue}</b></p>
                    {options.map((option, optionIndex) => {
                        console.log('dit is option' + option)
                        return (
                            <div className='radio_box'>
                                <div className='radio_div' key={option}>
                                    <input className='input'
                                        type='text'
                                        defaultValue={option}
                                        onChange={event => replaceOptions(optionIndex, event.target.value)}>
                                    </input>
                                    <button onClick={() => switchOptions(options, optionIndex, optionIndex - 1)}>Up</button>
                                    <button onClick={() => switchOptions(options, optionIndex, optionIndex + 1)}>Down</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
    /* re-renders the question in the textarea depending on the id parameter. */
    useEffect(() => {
        setQuestionValue(question[id].question);
    }, [id]);

    /* The main template of changeQuestion(). 
    We put in renderQuestion() on top to combine it. */
    return (
        <div>
            {renderQuestion()}
            {(questionvalue !== '')
                ? ''
                : <span style={{ color: 'red' }}>Vraag mag niet leeg zijn!</span>}
            {(questionvalue.length !== 250)
                ? ''
                : <span style={{ color: 'red' }}>Vraag kan niet meer dan 250 karakters bevatten</span>}
            <p>{message}</p>
            <div className='save_question_border'>
                <div className='save_question_box'>
                    <textarea type='text' className='textarea' maxLength={250} value={questionvalue} onChange={(e) => setQuestionValue(e.target.value)}></textarea>
                    <button className='button' onClick={() => handleModify(question[id].id, questionvalue)}>Aanpassen</button>
                    <button className='button' onClick={() => SaveQuestion()}>Opslaan</button>
                </div>
            </div>
            {/* Links back to Questionlist. */}
            <Link to='/questionlist'><button>Terug naar Vragenlijst</button></Link>
        </div>
    )
}

