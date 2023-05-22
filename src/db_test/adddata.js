import React from "react";
import { useEffect, useState } from "react";

export default function AddData() {

  let json = [
    {
      id:16,
      naam: 'test',
      latijnse_naam: 'test'
    }
  ]

  const lijst = json.map(data => 
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