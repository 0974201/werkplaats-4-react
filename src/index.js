import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './pages/header';
import Layout from './pages/layout';
import ModifyQuestion from './questions/questionlist';
import ChangeQuestion from './questions/changequestion';
import ChangeSurvey from './survey/changesurvey';
import { Login } from './pages/login';
import { NotFound } from './pages/NotFound';
import { SurveyList } from './survey/surveylist';
import SurveyQuestion from './survey/SurveyQuestions';
import SetUpSurvey from "./survey/set_survey";
import CreateSurvey from "./create_survey/create_survey";
import GetData from './db_test/getdata';
import './css/App.css';
import { func } from 'prop-types';

/* The App is what we throw everything inside. 
The Header in line 23 is imported from header.js.
The <Layout> is wrapped around the Routes so that they all have the same layout.*/
function App() {

    return (
        <div className='App'>
            <Header />
            <header className='App_header'></header>
            <Layout>
                <Routes>
                    <Route path='/' element={<Layout />} /> {/* Covers the entire website */}
                    <Route index element={<SurveyList />} />
                    <Route path={'/create'} element={<CreateSurvey endpoint={'saveNewSurvey'} />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/*' element={<NotFound />} />
                    <Route path='/surveylist' element={<SurveyList />} />
                    <Route path={'/survey/:id'} element={<SetUpSurvey page={'survey'} />} />
                    <Route path='/changesurvey/:id' element={<ChangeSurvey />} />
                    <Route path='/surveyquestions/:id' element={<SurveyQuestion />} />
                    <Route index element={<ModifyQuestion />} />
                    <Route path='/questionlist' element={<ModifyQuestion />} />
                    <Route path='/question/:id' element={<ChangeQuestion />} />
                </Routes>
            </Layout>
        </div>
    )
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

