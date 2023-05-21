import React from "react";

export default function Progressbar({checkedAnswerd, amountQuestion}) {
    let progress = (100/amountQuestion*checkedAnswerd) + '%'

    const containerStyle = {
        height: '10px',
        width: 'available',
        backgroundColor: "#e0e0de",
        borderRadius: '50px',
        margin: '5px'
    }
    const barStyle = {
        height: '100%',
        width: progress,
        backgroundColor: 'lightsteelblue',
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 1s ease-in-out'
    }

    return (
        <div style={containerStyle}>
            <div style={barStyle}></div>
        </div>
    )
}