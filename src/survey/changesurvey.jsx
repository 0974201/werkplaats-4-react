import React from 'react';
import { Navigate } from 'react-router';
import SetUpSurvey from './set_survey';

function ChangeSurvey() {

    //checks if user is in sess storage, if not redirect to login page.
     if(localStorage.getItem("user") === null){
        return <Navigate replace to="/login" />;
    }

    return (
        <SetUpSurvey page={'create'}>
        </SetUpSurvey>

    )
}

export default ChangeSurvey
