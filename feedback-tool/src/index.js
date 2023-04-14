import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from './SuperVegeta.gif';
import './App.css';


function App() {
    return (
        <div className='App'>
            <header className='App_header'>
                <div className='gif_text'>
                    <h1>Suiker Suiker Suiker</h1>
                </div>
                <div className='gif_container'>
                    <img src={logo} alt='Smug blonde monkeyman pointing at himself' style={{ position: 'absolute', zIndex: -1 }}></img>
                    <h2 style={{ zIndex: 1 }}>Doogggg</h2>
                </div>
            </header>
        </div>

    )
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />)

