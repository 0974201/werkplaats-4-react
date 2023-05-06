import React, { useEffect, useState } from 'react';
import { View, Text, Flatlist } from 'react-native';

import './App.css';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:81/test')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
  },[]);

  const Item = ({title}) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  return (
    <div className="App">
      <View>
        <Flatlist>
          data={data}
          renderItem={({item}) => <Item title={item.title} />} 
          keyExtractor={item => item.id}
        </Flatlist>
      </View>
    </div>
  );
}

export default App;