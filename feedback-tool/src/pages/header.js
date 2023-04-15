import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <div classname='header'>
                <div className='header_information'>
                    <div className='header_links'>
                        <Link to='/' style={{ marginLeft: '10px', marginRight: '20px' }}>Home</Link>
                        <Link to='./About' style={{ marginRight: '20px' }}>About us</Link>
                        <Link to='./contact' style={{ marginRight: '20px' }}>Contact Us</Link>
                    </div>
                    <div className='nav_login'>
                        <Link to='./Login'>Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header