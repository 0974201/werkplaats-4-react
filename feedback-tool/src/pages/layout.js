import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout(props) {
    return (
        <div className='container'>
            {props.children}
        </div>

    )
}

export default Layout