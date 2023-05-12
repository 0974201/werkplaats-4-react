import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './pages/header';
import Layout from './pages/layout';
import ModifyQuestion from './questions/questionlist';
import ChangeQuestion from './questions/changequestion';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NotFound } from './pages/NotFound';
import { SurveyList } from './survey/surveylist';
import Survey2 from './survey/survey';
import CreateSurvey from "./create_survey/create_survey";
import './css/App.css';

/* The App is what we throw everything inside. 
The Header in line 23 is imported from header.js.
The <Layout> is wrapped around the Routes so that they all have the same layout.*/

export let questions = [
    {
        type: "MultipleChoice",
        id: 0,
        question: "Wat is de naam van je vis?",
        options: ['Bubbles', 'John', 'Speedy', 'The drowned one'],
        order: 0
    },
    {
        type: "Open",
        id: 1,
        question: "Hoe heet je huis spin?",
        options: null,
        order: 1
    },
    {
        type: "MultipleChoice",
        id: 2,
        question: "Wat is de naam van je kat?",
        options: ['Scratch', 'Tiger', 'Spot', 'Nigel'],
        order: 2
    },
    {
        type: "Open",
        id: 3,
        question: "Van welke saus hou je?",
        options: null,
        order: 3
    }
]
/* Just testing.. */
export let surveys = [
    {
        status: "Open",
        id: 0,
        title: "Huisdiernamen",
        participants: "5"
    },
    {
        status: "Closed",
        id: 1,
        title: "Telefoongebruik",
        participants: "27"
    },
    {
        status: "Being reviewed",
        id: 2,
        title: "Eet jij genoeg cornflakes?",
        participants: "0"
    }

]
function App() {
    return (
        <>
            <div className='App'>
                <Header />
                <header className='App_header'>
                </header>
                <Layout>
                    <Routes>
                        <Route path='/' element={<Layout />} /> {/* Covers the entire website */}
                        <Route index element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/*' element={<NotFound />} />
                        <Route path='/surveylist' element={<SurveyList survey={surveys} />} /> {/* Covers the survey parts */}
                        <Route index element={<SurveyList />} />
                        {/* <Route path='/survey/:id' element={<Survey />} /> */}
                        <Route path={'/create'} element={<CreateSurvey />} />
                        <Route index element={<ModifyQuestion />} />
                        <Route path='/questionlist' element={<ModifyQuestion />} />
                        <Route path='/question' element={<ChangeQuestion question={questions} />} />
                        <Route path='/question/:id' element={<ChangeQuestion question={questions} />} />
                        <Route path={'/survey'} element={<Survey2 questionsArray={questions} />} />
                        <Route />
                        <Route />
                    </Routes>
                </Layout>
            </div>
        </>
    )
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>)

