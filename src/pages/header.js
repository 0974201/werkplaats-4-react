import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css'

// The Header for the website. //

function Header() {
    return (
        <nav>
            <div className='header'>
                <div className='header_information'>
                    <Link to='/'>
                        <img className="SVG" alt={"Logo"} width="208" height="50" src="https://www.dyflexis.com/wp-content/uploads/2019/04/logo-dyflexis-2.svg"></img>
                    </Link>
                    <div className='header_links'>
                        <Link to='./survey' className='link'>Enquête</Link>
                        <Link to='./surveylist' className='link'>Enquêtelijst</Link>
                        <Link to='./questionlist' className='link'>Vragenlijst</Link>
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