import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import { render } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
function App() {
  const[check, setcheck]=useState(null);
  useEffect(()=>{
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username:'upskillerAdmin',password:'1234'})
    };
    function dataLoading() {
      fetch('http://localhost:5000/user/login', requestOptions).then((res)=>res.json).then((data)=>setcheck(data));
    };
  },[]);
  return (
<form  noValidate autoComplete="off">
  <TextField id="standard-basic" label="Standard" />
  <TextField id="filled-basic" label="Filled" variant="filled" />
  <TextField id="outlined-basic" label="Outlined" variant="outlined" />
</form>
  );
}

export default App;
