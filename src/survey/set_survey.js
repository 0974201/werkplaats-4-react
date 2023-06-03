import Group from "../universal/GroupBy";
import {useEffect, useState} from "react";
import Survey from "./survey";
import {surveyTest} from "../index";
import {useParams} from "react-router-dom";

export default function SetUpSurvey() {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log(survey)
    console.log(surveyTest)

    async function fetchSurvey() {
        const rawSurvey = await fetch('http://localhost:81/api/getSurvey/' + id)
        const survey = await rawSurvey.json()
        const rawQuestions = await fetch('http://localhost:81/api/getSurveyQuestions/' + id)
        const Questions = await rawQuestions.json()
        const rawOptions = await fetch('http://localhost:81/api/getSurveyOptions/' + id)
        const options = await rawOptions.json()
        const groupedOptions = Group(options)

        const newQuestions = Questions.map(question => {
            if (question.Multiple_Choice_ID !== null) {
                const matchGroup = Object.keys(groupedOptions).find(group => question.Multiple_Choice_ID === parseInt(group))
                if (matchGroup) {
                    const onlyOptions = groupedOptions[matchGroup].map(optionPlusId => optionPlusId.option)
                    return {...question, answer: '', options: onlyOptions}
                } else {
                    return {...question, answer: '', options: ''}
                }
            } else {
                return {...question, answer: '', options: ''}
            }
        })
        const test = {...survey, questions: newQuestions}
        console.log(test)
        setSurvey(test)
        setLoading(false)
    }

    useEffect(() => {
        fetchSurvey()
    },[])

    if (loading) {
        return <div>help</div>
    }

    return (
        <Survey surveyArray={survey} />
        // <div>hi</div>
    )
}