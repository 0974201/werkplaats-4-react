import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './SuperVegeta.gif';
import Header from './pages/header';
import { Home } from './pages/home';
import { Contact } from './pages/contact';
import { About } from './pages/about';
import { Login } from './pages/login';
import { NotFound } from './pages/NotFound';
import { Survey } from './pages/survey';
import './css/App.css';


function App() {
    return (
        <>
            <div className='App'>
                <Header />
                <header className='App_header'>
                </header>
            </div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/about' element={<About />} />
                <Route path='/login' element={<Login />} />
                <Route path='/survey' element={<Survey />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </>
    )
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>)

