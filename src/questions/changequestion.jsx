import React, { useState, useEffect } from 'react';
import './changequestion.css';
import { useParams, Link } from 'react-router-dom';
import SwitchAround from '../universal/switch_around.js'
import { saveToDB } from '../universal/manipulateDB';


export default function ChangeQuestion({ }) {
    const { id } = useParams();
    const [questionlist, setQuestion] = useState('');
    const [questionvalue, setQuestionValue] = useState('');
    const [options, setOptions] = useState('')
    const [message, setMessage] = useState('')
    const [showmessage, setShowMessage] = useState(false)
    const [fetchedquestion, showQuestion] = useState([])

    /* Allows us to access the value outside the map*/
    const fetchedvalue = fetchedquestion.map((item) => item.question);
    const fetchedopen = fetchedquestion.map((item) => item.open_question_ID);
    const fetchedMC = fetchedquestion.map((item) => item.Multiple_Choice_ID);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:81/api/questions/${id}`);
            const data = await result.json();
            const question = data.question;
            console.log(data);
            showQuestion(data)
        };
        fetchData();
    }, [fetchedquestion]);

    /* Timer for message... 5000 is 5 seconds */
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setShowMessage('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    /* Saves the question to the database.*/
    function SaveQuestion() {
        const saveArray = {
            question: questionvalue,
            questionId: id,
            options: options,
            type: 'Open',
        }
        saveToDB(saveArray, 'questions');
        setMessage('Vraag is succesvol opgeslagen!')
        setShowMessage(true);
    }
    console.log(SaveQuestion)

    /* This is the Up and Down buttons that allow us to change the order of options.*/
    function switchOptions(list, fromIndex, toIndex) {
        const newList = SwitchAround(list, fromIndex, toIndex)
        setOptions(newList)
    }

    /* Changes the question to the value that is put in the textarea element */
    const handleModify = (id, newQuestion) => {
        let updatedQuestion = fetchedquestion.map(question => {
            if (question.id === id && newQuestion !== '') {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        setQuestion(updatedQuestion)
        setMessage('Vraag is aangepast!')
        setShowMessage(true);
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

    /* Checks for whether the question type is Open or Multiple Choice depending on the id in the array. */
    function renderQuestion() {
        if (fetchedopen) {
            return (
                <>
                    <h1>Open vraag {id} </h1>
                    {fetchedquestion.map(item =>
                        <p><b>{item.question}</b></p>)}

                </>
            )
        } else if (fetchedMC) {
            return (
                <div>
                    <h1>Multiple Choice Vraag {id}</h1>
                    <p><b>{questionvalue}</b></p>
                    {options.map((option, optionIndex) => {
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
    // useEffect(() => {
    //     setQuestionValue(question[id].question);
    // }, [id]);

    /* The main template of changeQuestion(). 
    We put in renderQuestion() on top to combine it. */
    return (
        <div>
            <div
                className={`changequestion_message ${showmessage ? 'alert-shown' : 'alert-hidden'}`}
            >
                {showmessage && (
                    <p className="error"> {message} </p>
                )}
            </div>
            {renderQuestion()}
            {(questionvalue !== '')
                ? ''
                : <span style={{ color: 'red' }}>Vraag mag niet leeg zijn!</span>}
            {(questionvalue.length !== 250)
                ? ''
                : <span style={{ color: 'red' }}>Vraag kan niet meer dan 250 karakters bevatten</span>}
            <div className='save_question_border'>
                <div className='save_question_box'>
                    <textarea type='text' className='textarea' maxLength={250} defaultValue={questionvalue} onChange={(e) => setQuestionValue(e.target.value)}></textarea>
                    <button className='button' onClick={() => handleModify(id, questionvalue)}>Aanpassen</button>
                    <button className='button' onClick={() => SaveQuestion()}>Opslaan</button>{console.log(SaveQuestion)}
                </div>
            </div>
            {/* Links back to Questionlist. */}
            <Link to='/questionlist'><button>Terug naar Vragenlijst</button></Link>
        </div>
    )
}

