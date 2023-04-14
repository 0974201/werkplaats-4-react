import react from 'react';

function Header() {
    return (
        <nav>
            <div className='header_information'>
                Home
                About
                <Link to='./Contact'>Contact Us</Link>
            </div>
        </nav>
    )
}

export default Header