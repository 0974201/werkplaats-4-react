import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <div className='header_information'>
                Home
                About
                <Link to='./contact'>Contact Us</Link>
            </div>
        </nav>
    )
}

export default Header