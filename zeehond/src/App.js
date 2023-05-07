import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import './App.css';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:3000/test')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
  },[]);

  return (
    <div className="App">
      <View>
        <FlatList>
          data={data}
          renderItem={({item}) => <Text>{item.name}</Text>} 
          keyExtractor={item => item.id}
        </FlatList>
      </View>
    </div>
  );
}

export default App;