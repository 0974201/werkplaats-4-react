import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './overview.css'


function OverView() {
    const [overzichtlijst, setOverzicht] = useState([])
    const { id } = useParams();

    console.log(id)

    /* Fetches the api */
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('http://localhost:81/api/filled_surveys');
            const data = await result.json();
            console.log(data);
            setOverzicht(data)
        };
        fetchData();
    }, []);

    return (
        <div className="overview_table">
            <h1 className="overview_title">Overzicht</h1>
            <table width='100%'>
                <tbody>
                    <tr>
                        <th>Antwoorden</th>
                        <th>Gebruiker ID</th>
                    </tr>
                    {overzichtlijst.map(answer => (
                        <tr key={answer.Question_ID}>
                            <td>
                                {answer.answer}
                            </td>
                            <td>
                                {answer.User_ID}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
}


export default OverView