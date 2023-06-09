import React, {useEffect} from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Survey from '../survey/survey'
import SwitchAround from "../universal/switch_around";
import './creat_survey.css'
import './pop_up.css'
import '../universal/message/message.css'
import { saveToDB } from "../universal/manipulateDB";
import ShowMassage from "../universal/message/message";

let nextOrder = 0

// this function is very big because if you split it up into different files en functions some function get a bug that when you
// type in an input field the field loses focus, and you stop typing
export default function CreateSurvey({ endpoint }) {
    console.log(endpoint)
    const [questionArray, setQuestionArray] = useState(onLoadArray())
    const [surveyArray, setSurveyArray] = useState(onLoadSurvey())
    const [buttonState, setButtonState] = useState(false)
    const [showConfirmMessage, setShowConfirmMessage] = useState(false)
    const [showWarningMessage, setShowWarningMessage] = useState(false)
    console.log(surveyArray)

    sessionStorage.setItem("createSurvey", JSON.stringify(surveyArray))

     //checks if user is in sess storage, if not redirect to login page.
     if(localStorage.getItem("user") === null){
        return <Navigate replace to="/login" />;
    }

    function onLoadSurvey() {
        if (JSON.parse(sessionStorage.getItem("createSurvey")) === null) {
            const arrayToSurvey = {
                title: "",
                description: "",
                open_date: "",
                close_date: "",
                questions: questionArray,
                anonymity: true
            }
            return (arrayToSurvey)
        } else {
            const arrayToSurvey = JSON.parse(sessionStorage.getItem("createSurvey"))
            return (arrayToSurvey)
        }
    }

    function onLoadArray() {
        if (JSON.parse(sessionStorage.getItem("createSurvey")) === null) {
            const arrayToSurvey = [{ type: "Open", id: nextOrder++, question: '', options: null, order: null }]
            return (arrayToSurvey)
        } else {
            const arrayToSurvey = JSON.parse(sessionStorage.getItem("createSurvey"))
            return (arrayToSurvey.questions)
        }
    }

    function addToArray(inBetweenArray) {
        const newArray = inBetweenArray.map((question, questionIndex) => {
            return { ...question, id: questionIndex }
        })
        setQuestionArray(newArray)
        setSurveyArray({ ...surveyArray, questions: newArray })
    }

    function replaceQuestion(questionIndex, value) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.question = value
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function replaceOption(questionIndex, optionIndex, value) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options[optionIndex] = value
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function replaceSurveyItem(item, value) {
        switch (item) {
            case 'title':
                setSurveyArray({ ...surveyArray, title: value })
                break
            case 'description':
                setSurveyArray({ ...surveyArray, description: value })
                break
            case 'open_date':
                setSurveyArray({ ...surveyArray, open_date: value })
                break
            case 'close_date':
                setSurveyArray({ ...surveyArray, close_date: value })
                break
            case 'anonymity':
                if (value === true) {
                    const inBetweenArray = { ...surveyArray, anonymity: false }
                    setSurveyArray(inBetweenArray)
                } else {
                    const inBetweenArray = { ...surveyArray, anonymity: true }
                    setSurveyArray(inBetweenArray)
                }
                break
            default:
                console.log(item + "is not a valid input")
        }
    }

    function switchQuestions(array, fromIndex, toIndex) {
        const inBetweenArray = SwitchAround(array, fromIndex, toIndex)
        addToArray(inBetweenArray)
    }

    function switchOptions(list, fromIndex, toIndex, questionId) {
        const inBetweenArray = questionArray.map(question => {
            if (question.id === questionId) {
                return { ...question, options: SwitchAround(list, fromIndex, toIndex) }
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function addQuestion(question) {
        const inBetweenArray = [...questionArray, question]
        addToArray(inBetweenArray)
    }

    function addOption(questionIndex) {
        const inBetweenArray = questionArray.map((question, i) => {
            if (i === questionIndex) {
                question.options = [...question.options, '']
                return question
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function deleteOptionInQuestion(questionId, optionIndex) {
        const inBetweenArray = questionArray.map(question => {
            if (question.id === questionId && question.options.length > 2) {
                const newOptions = question.options.filter((value, index) => index !== optionIndex)
                return { ...question, options: newOptions }
            } else {
                return question
            }
        })
        addToArray(inBetweenArray)
    }

    function AddButtons() {
        return (
            <div className={'create'}>
                <h2>Selecteer vraag type</h2>
                <button onClick={() => addQuestion({ type: "Open", id: nextOrder++, question: '', options: null, order: null })}>Maak open vraag</button>
                <button onClick={() => addQuestion({ type: "MultipleChoice", id: nextOrder++, question: '', options: ['', ''], order: null })}>Maak multiple choice vraag</button>
                <button onClick={() => setButtonState(true)}>Kies bestaande vraag</button>
            </div>
        )
    }

    function Preview() {
        return (
            <div className={'create'}>
                <h2>Preview</h2>
                {questionArray.length > 0 &&
                    <Survey surveyArray={surveyArray} />
                }
            </div>
        )
    }

    function PopUp() {
        const [question, setQuestion] = useState([]);
        const [search, setSearch] = useState('')
        const [message, showMessage] = React.useState(false)

        /* This should fetch the data asynchronously if you import GetDB */
        useEffect(() => {
            const fetchData = async () => {
                const result = await fetch('http://localhost:81/api/questions?open=notdeleted');
                const data = await result.json()
                setQuestion(data)
            };
            fetchData();
        }, []);

        /* Timer for message.. 5000 is 5 seconds */
        useEffect(() => {
            if (message) {
                const timer = setTimeout(() => {
                    showMessage('')
                }, 5000)

                return () => clearTimeout(timer)
            }
        }, [message])

        /* Shows everything that is not deleted for questions */
        function showQuestions() {
            const fetchData = async () => {
                const result = await fetch('http://localhost:81/api/questions?open=notdeleted')
                const data = await result.json()
                setQuestion(data)
            };
            fetchData();
        }

        /* Shows  Open Questions for questions */
        function showOpenQuestions() {
            try {
                const fetchData = async () => {
                    const result = await fetch('http://localhost:81/api/questions?open=OpenQuestions')
                    const data = await result.json()
                    setQuestion(data)
                };
                fetchData();
            } catch (error) {
                console.error(error)
            }
        }

        /* Shows multiple choice for questions */
        function showMultipleChoice() {
            const fetchData = async () => {
                const result = await fetch('http://localhost:81/api/questions?open=MultipleChoiceQuestions')
                const data = await result.json()
                setQuestion(data)
            }
            fetchData()
        }

        /* The sidebar that gets the queries. If clicked show the corresponding queries.*/
        function questionBox() {
            return (
                <div className={'filter'}>
                    <span>Filters</span>
                    <div onClick={showQuestions}>
                        <span>Alle Vragen</span>
                    </div>
                    <div onClick={showOpenQuestions}>
                        <span>Open Vragen</span>
                    </div>
                    <div onClick={showMultipleChoice}>
                        <span>Multiple Choice</span>
                    </div>
                </div>
            )
        }

        function convertQuestion(item) {
            if (item.multi_question !== null) {
                return {
                    type: 'MultipleChoice',
                    question: item.multi_question,
                    options: ['1', '2'],
                }
            } else {
                return {
                    type: 'Open',
                    question: item.open_question,
                    options: null,
                }
            }
        }

        return (
            <div className={'pop_up_container'}>
                <div className={'pop_up'}>
                    <div className={'pop_up_content'}>
                        <div>
                            <div className={'search'}>
                                <input type='text' placeholder='Zoek Vraag..' onChange={(e) => setSearch(e.target.value)}></input>
                                <button className={'close'} onClick={() => setButtonState(false)}>X</button>
                            </div>
                            <div className={'qBox'}>
                                {questionBox()}
                                <table width='100%'>
                                    <tbody>
                                    <tr>
                                        <th>Vraag</th>
                                        <th>Type</th>
                                    </tr>
                                    {question.filter((item) => {
                                        return search.toLowerCase() === ''
                                            ? item
                                            : item.open_question?.toLowerCase().includes(search) || item.multi_question?.toLowerCase().includes(search)
                                    }).map(item => (
                                        <tr key={item.Question_ID}>
                                            <td>
                                                <span>{item.open_question}</span>
                                                <span>{item.multi_question}</span>
                                            </td>
                                            <td>{(item.Open_Question_ID != null) ? <span>Open</span> : <span>Multiple Choice</span>}</td>
                                            <td>
                                                <span>
                                                    <button onClick={() => {

                                                        addQuestion(convertQuestion(item))
                                                    }}>Selecteer</button>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={'container__create_survey'}>
            <div className={'box'}>
                <div className={'create'}>
                    <h2>Geef extra informatie</h2>
                    <label> Titel
                        <input
                            placeholder={'Titel'}
                            value={surveyArray.title}
                            onChange={e => replaceSurveyItem('title', e.target.value)}
                        />
                    </label>
                    <label>Begin tijd
                        <input
                            type={'date'}
                            value={surveyArray.open_date}
                            min={new Date().toJSON().slice(0, 10)}
                            onChange={e => replaceSurveyItem('open_date', e.target.value)}
                        />
                    </label>
                    <label>Eind tijd (optioneel)
                        <input
                            type={'date'}
                            value={surveyArray.close_date}
                            onChange={e => replaceSurveyItem('close_date', e.target.value)}
                        />
                    </label>
                    <label>Beschrijving
                        <textarea
                            placeholder={'Beschrijving'}
                            value={surveyArray.description}
                            onChange={e => replaceSurveyItem('description', e.target.value)}
                        ></textarea>
                    </label>

                    <label>Deze enquête kan niet anoniem beantwoord worden
                        <input
                            type={'checkbox'}
                            onChange={e => replaceSurveyItem('anonymity', e.target.checked)}
                        />
                    </label>
                </div>
                <AddButtons />
            </div>

            <div className={'box'}>
                <div className={'create'}>
                    {questionArray.map((question, questionIndex) => (
                        <div key={questionIndex} className={'question'}>
                            <h3>Vraag {questionIndex + 1}</h3>
                            <div className={'question_input'}>
                                <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex - 1)}>Up</button>
                                <button onClick={() => switchQuestions(questionArray, questionIndex, questionIndex + 1)}>Down</button>
                                <input
                                    placeholder={'maak vraag'}
                                    value={questionArray[questionIndex].question}
                                    onChange={e => replaceQuestion(questionIndex, e.target.value)}
                                />

                                {/* delete question button*/}
                                <button onClick={() => (
                                    addToArray(questionArray.filter(question =>
                                        question.id !== questionArray[questionIndex].id)
                                    )
                                )}>X</button>
                            </div>

                            {question.type === 'MultipleChoice' &&
                                <>
                                    <ul>
                                        {question.options.map((option, optionIndex) => (
                                            <li key={optionIndex}>
                                                <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex - 1, question.id)}>Up</button>
                                                <button onClick={() => switchOptions(questionArray[questionIndex].options, optionIndex, optionIndex + 1, question.id)}>Down</button>
                                                <input
                                                    placeholder={'maak optie'}
                                                    maxLength={250}
                                                    value={option}
                                                    onChange={e => replaceOption(questionIndex, optionIndex, e.target.value)}
                                                />
                                                <button onClick={() => (deleteOptionInQuestion(question.id, optionIndex))

                                                }>X</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => addOption(questionIndex)}>Maak multiple choice optie</button>
                                </>
                            }
                        </div>
                    ))}
                </div>
                <div className={'create'}>
                    <button onClick={() => {
                        if (
                            surveyArray.open_date === '' ||
                            surveyArray.title === '' ||
                            surveyArray.description === '' ||
                            surveyArray.questions === ''
                        ) {
                            setShowWarningMessage(true)
                        } else {
                            saveToDB(surveyArray, endpoint)
                            setShowConfirmMessage(true)
                            sessionStorage.removeItem("createSurvey")
                        }

                    }}>Opslaan</button>
                </div>
            </div>

            <div className={'box'}>
                <Preview />
            </div>
            {buttonState &&
                <PopUp />
            }
            { showConfirmMessage &&
                <ShowMassage message={'Enquête opgeslagen'} type={'confirm'} onClick={() => setShowConfirmMessage(false)} />
            }
            { showWarningMessage &&
                <ShowMassage message={'Niet alles in de enquête is ingevuld'} type={'warning'} onClick={() => setShowWarningMessage(false)} />
            }
        </div>
    )
}