import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import './App.css';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:81/test_gaem')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error(error));
  },[]);

  return (
    <div className="App">
      <View>
        <FlatList>
          data={data}
          renderItem={({item}) => <Text>{item.release_year}</Text>} 
          keyExtractor={item => item.release_name}
        </FlatList>
      </View>
    </div>
  );
}

export default App;