import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import './App.css';
import { response } from 'express';

function App() {
  //const [release_year, setYear] = useState('');
  //const [release_name, setName] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:81/test_gaem',{
      'methods':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => setData(response))
    .catch(error => console.error(error));
  },[]);

  const Lijst = (props) => {
    return (
      <div>
        <p>hi</p>
        {/*{ props.data && props.data.map(data => {*/}
        {/*  <ul>*/}
        {/*    <li>{ data.release_year }</li>*/}
        {/*    <li>{ data.release_name}</li>*/}
        {/*  </ul>*/}
        {/*})}*/}
      </div>
    )
  }

  /*return (
    <div className="App">
      <View>
        <FlatList>
          data={data}
          renderItem={({item}) => <Text>{item.release_year}</Text>} 
          keyExtractor={item => item.release_name}
        </FlatList>
      </View>
    </div>
  );*/
}

export default App;