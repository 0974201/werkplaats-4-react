import React from 'react';
import { Outlet } from 'react-router-dom';

/* The layout for the entire website.
   The props.children allows us to nest all the other pages into the layout. */

function Layout(props) {
    return (
        <div className='container'>
            {props.children}
        </div>

    )
}

export default Layout