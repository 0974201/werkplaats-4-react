import React, { useState } from 'react';
import './questions.css';
import { useParams, Link } from 'react-router-dom';
import { questions } from '../index.js'


export default function ChangeQuestion({ question }) {
    const [value, setValue] = useState('')
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    const [questionlist, setQuestion] = useState(questions);
    const [option, setSelectedOption] = useState(questions);

    const handleClick = () => {
        setIsEditing(true);
    }

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
        setQuestion(updatedQuestion)
        question[id].question = newQuestion;
    };


    /* Checks for whether the question type is Open or Multiple Choice */
    return (
        <div>
            {question[id].type === 'Open' &&
                <>
                    <h1> Change Question {id}</h1>
                    <p><b>{questionlist[id].question}</b></p>
                    <div className='save_question_border'>
                        <div className='save_question_box'>
                            <textarea type='text' className='textarea' value={value} onChange={e => setValue(e.target.value)}></textarea>
                            <button className='button' onClick={() => handleModify(id, value)}>Modify</button>
                            <button className='button'>Save</button>
                        </div>
                    </div>
                </>
            }
            {question[id].type === 'MultipleChoice' &&
                <>
                    <h1> Change Multiple Choice Question {id}</h1>
                    <p><b>{questionlist[id].question}</b></p>
                    {questionlist[id].options.map((option) => {
                        return (
                            <div className='radio_box'>
                                <div className='radio_div' key={option}>
                                    <input
                                        type='radio'
                                        name='options'
                                        value={option}
                                    /> {isEditing ? (
                                        <input
                                            type='text'
                                            defaultvalue={option}
                                            onChange=''>
                                        </input>

                                    ) : (
                                        <label onClick={handleClick}>{option}</label>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div className='save_question_border'>
                        <div className='save_question_box'>
                            <textarea type='text' className='textarea' value={value} onChange={e => setValue(e.target.value)}></textarea>
                            <button className='button' onClick={() => handleModify(id, value)}>Modify</button>
                            <button className='button'>Save</button>
                        </div>
                    </div>
                </>
            }

            {/* buttons for Previous and Next Id's in the Array. */}

            <Link to={id > 0 ? `/question/${question[id].id - 1}` : ''}><button disabled={id === '0'} className='button'>Previous</button></Link>
            {id < (questionlist.length - 1) ? /* if current id is lower than the questionlist array (-1  due to index!) */
                <Link to={`/question/${question[id].id + 1}`}><button className='button'>Next</button></Link>
                : /* button is disabled if there is no more questions with a higher id in the array.*/
                <button disabled className='button'>Next</button>
            }
        </div >
    )
}
