import React from 'react';

// This is the page users land on if they enter an invalid link or url. //

export function NotFound() {
    return (
        <>
            <div>
                <h1>Error</h1>
                <div>
                    <p>The page you're looking for does not exist.</p>
                </div>
            </div>
        </>
    )
}