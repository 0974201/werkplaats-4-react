import React from 'react';
import { useParams } from 'react-router-dom';

export function Survey() {
    const { id } = useParams();
    return (
        <div>
            <h1>Survey {id} Time</h1>
        </div>
    )
}