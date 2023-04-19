import React from 'react';
import { useParams } from 'react-router-dom';

/* We use useParams to get the id parameter
   and this allows us to pass it on to the website.*/

export function Survey() {
    const { id } = useParams();
    return (
        <div>
            <h1>Survey {id} Time</h1>
        </div>
    )
}