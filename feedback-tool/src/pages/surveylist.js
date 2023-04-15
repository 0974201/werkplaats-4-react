import React from 'react';
import { Link } from 'react-router-dom';

export function SurveyList() {
    const numOfSurveys = 20; // Change this to the number of surveys you want to display
    const surveys = [];

    for (let i = 1; i <= numOfSurveys; i++) {
        surveys.push(
            <div key={i} className='survey_link'>
                <Link to={`/survey/${i}`}>Survey {i}</Link><br></br>
            </div >
        );
    }

    return (
        <>
            <div>
                <h1>Surveys</h1>
                {surveys}
            </div>
        </>
    );
}
