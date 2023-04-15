import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <div className='header_information'>
                <Link to='./Home'>Home</Link>
                <Link to='./About'>About us</Link>
                <Link to='./contact'>Contact Us</Link>
            </div>
            <div className='nav_login'>
                <Link to='./Login'>Login</Link>
            </div>
        </nav>
    )
}

export default Header