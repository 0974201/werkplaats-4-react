import React from 'react';
import { useState } from 'react';
import './questions.css';
import Survey2 from '../survey/survey'



function Questions() {
    const [name, setName] = useState('');

    return (
        <div>
            <h1> Questions </h1>
            <Survey2 />
            <button>Click here</button>
            <input value={name} onChange={e => setName(e.target.value)} />
        </div>
    )
}

export default Questions