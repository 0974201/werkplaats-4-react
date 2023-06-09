import React, {useEffect} from "react";
export default function ShowMassage({message, type, onClick}) {
    // asked ChatGPT for a way to move the timer to the component itself. dit not know that you can pass an onClick
    useEffect(() => {
        const messageTimer = setTimeout(() => {
            onClick();
        }, 2500)

        return () => clearTimeout(messageTimer)
    }, [onClick])

    if (type === 'confirm') {
        return(
            <div id={'confirm'} className={'messageBox'}>
                <span>{message}</span>
            </div>
        )
    } else if (type === 'warning') {
        return(
            <div id={'warning'} className={'messageBox'}>
                <span>{message}</span>
            </div>
        )
    } else {
        return(
            <div id={'normal'} className={'messageBox'}>
                <span>{message}</span>
            </div>
        )
    }
}