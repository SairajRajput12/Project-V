import React, { useState } from 'react';
import axios from 'axios';
import AdminPanel from './AdminPanel';


function LoginForm() {
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isHeLogin,setisHeLogin] = useState(false); 
  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'black',
    borderRadius: '10px',
    marginBottom: '30px', // Add margin at the bottom for spacing
  };
  

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formGroupStyle = {
    marginBottom: '15px', // Increase spacing between label and input
  };

  const labelStyle = {
    fontWeight: 'bold',
    padding:'6px'
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin:'6px'
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#337ab7',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };


  const handleLogin = async () => {
    try {
      const data = {
        adminId: adminId,
        adminName: adminName,
        password: password,
      };

      console.log(data); 
      
      setAdminName('') 
      setPassword('') 
      setAdminId('')
      const response = await axios.post('/verify', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response from the Flask backend
      console.log(response.data);
      if(response.data.message === 'Data is present in the database'){
        setisHeLogin(true); 
      }
    } catch (error) {
      // Handle errors, provide user-friendly feedback if needed
      console.error(error);
    }
  };

  return (
    <>
    <div style={formContainerStyle}>
      <h2>Admin Login</h2>
      <form style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="adminName">
            Admin Name
          </label>
          <input
            type="text"
            id="adminName"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="adminId">
            Admin ID
          </label>
          <input
            type="text"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button type="button" onClick={handleLogin} style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
      
      {isHeLogin && (
          <AdminPanel onCancel={() => setisHeLogin(false)} dataProp ={adminName}/>
      )}
    
    </>
  );
}

export default LoginForm;
