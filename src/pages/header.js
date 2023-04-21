import React from 'react';
import { Link } from 'react-router-dom';

// The Header for the website. //

function Header() {
    return (
        <nav>
            <div classname='header'>
                <div className='header_information'>
                    <Link to='/'>
                        <img className="SVG" alt={"Logo"} width="208" height="50" src="https://www.dyflexis.com/wp-content/uploads/2019/04/logo-dyflexis-2.svg"></img>
                    </Link>
                    <div className='header_links'>
                        <Link to='/' className='link'>Home</Link>
                        <Link to='./About' className='link' >About us</Link>
                        <Link to='./contact' className='link'>Contact Us</Link>
                        <Link to='./survey' className='link'>Survey</Link>
                    </div>
                    <div className='nav_login'>
                        <div className='login_button'>
                            <Link to='./Login' className='link'>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header