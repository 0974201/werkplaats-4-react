import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './SuperVegeta.gif';
import Header from './pages/header';
import Layout from './pages/layout';
import Questions from './pages/questions';
import { Home } from './pages/home';
import { Contact } from './pages/contact';
import { About } from './pages/about';
import { Login } from './pages/login';
import { NotFound } from './pages/NotFound';
import { SurveyList } from './pages/surveylist';
import { Survey } from './pages/survey';
import Survey2 from './survey/survey';
import CreateSurvey from "./create_survey/create_survey";
import './css/App.css';

/* The App is what we throw everything inside. 
The Header in line 23 is imported from header.js.
The <Layout> is wrapped around the Routes so that they all have the same layout.*/

function App() {
    return (
        <>
            <div className='App'>
                <Header />
                <header className='App_header'>
                </header>
                <Layout>
                    <Routes>
                        <Route path='/' element={<Layout />} />
                        <Route index element={<Home />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/survey' element={<SurveyList />} />
                        <Route index element={<SurveyList />} />
                        <Route path='/survey/:id' element={<Survey />} />
                        <Route path={'/question'} element={<Survey2 />} />
                        <Route path={'/create'} element={<CreateSurvey />}/>
                        <Route />
                        <Route />
                        <Route path='/*' element={<NotFound />} />
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

