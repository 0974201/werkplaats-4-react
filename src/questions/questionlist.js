import React from 'react';
import { useState } from 'react';
import './questions.css';
import Survey2, { questions } from '../survey/survey'


function ModifyQuestion() {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState(questions);
    let nextId = 0

    const handleModify = (id, newQuestion) => {
        let updatedQuestion = question.map(question => {
            if (question.id === id) {
                return { ...question, question: newQuestion };
            } else {
                return question;
            }
        });
        setQuestion(updatedQuestion);
    };

    return (
        <div>
            <h1> Questions </h1>

            {question.map(item => (
                <div key={item.id}>{item.id + '. ' + item.question}
                    <input value={item.name} onChange={e => setName(e.target.value)} className='input' />
                    <button onClick={() => handleModify(item.id, name)}>Modify</button>
                    <button onClick={() => setQuestion(question.filter(q =>
                        q.id !== item.id))}>Delete</button>
                </div>
            ))}
        </div>
    )
}


export default ModifyQuestion