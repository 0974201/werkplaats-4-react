import React from 'react';
import { useState } from 'react';
import './questions.css';
import Survey2, { questions } from '../survey/survey'


function ModifyQuestion() {
    const [name, setName] = useState('');
    const [question, modifyQuestion] = useState(questions);
    let nextId = 0

    return (
        <div>
            <h1> Questions </h1>

            {question.map(item => (
                <div key={item.id}>{item.id + '. ' + item.question}<button>modify</button>
                </div>
            )
            )}
            {/* <button onClick={() => {
                modifyQuestion([
                    ...question,
                    { id: nextId++, question: name }
                ]);
            }}>Add</button> */}
            {/* {question.map(item => (
                <div key={item.id}>{item.name}</div>
            ))} */}
        </div>
    )
}

export default ModifyQuestion