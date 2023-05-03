import React, {useState} from "react";
import './pop_up.css'

export default function PopUp() {
    const [buttonState, setButtonState] = useState(false)
    return (
        <div>
            <button onClick={() => setButtonState(true)}>Selecteer een bestaande vraag</button>
            {buttonState && (
                <div className={'pop_up_container'}>
                    <div className={'pop_up'}>
                        <div className={'pop_up_content'}>
                            <p>did it</p>
                        </div>
                        <div className={'close'}>
                            <button onClick={() => setButtonState(false)}>X</button>
                        </div>

                    </div>
                </div>

            )}
        </div>

    )
}