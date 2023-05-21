import React from "react";
import { useEffect, useState } from "react";

export default function DbTest() {
  const [dbdata, setData] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:81/test_birb',{
      'methods':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => setData(response))
    .catch(error => console.error(error));
  },[]);
  
  console.log(dbdata[2]);
  const lijst = dbdata.map(data => 
        <p key={data.id}>
          <i>{data.latijnse_naam}</i> &nbsp;
          <b>{data.naam}</b>
        </p>);

  return(
    <div>
      {lijst}
    </div>
  )
}