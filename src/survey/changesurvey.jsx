import React from 'react';
import { useState, useEffect } from "react";
import { Navigate } from 'react-router';
import SetUpSurvey from './set_survey';

function ChangeSurvey() {

    const [getSession, setSession] = useState(null);

    //checks if user is in sess storage, if not redirect to login page.
    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if(user){
            setSession(user);
        }
    })

    if(!getSession){
        return <Navigate replace to="/login" />;
    }

    return (
        <SetUpSurvey page={'create'}>
        </SetUpSurvey>

    )
}

export default ChangeSurvey
