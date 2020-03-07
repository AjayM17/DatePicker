import React from 'react';
import logo from './logo.svg';
import DatePicker from './DatePicker/datepicker'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="datepicker_container">
      <DatePicker
      initialDate=''
      enablePreviousMonth= {false}
      setDate = { (date) => { 
        alert(date)
        }}
      />
      </div>
     
    </div>
  );
}

export default App;
