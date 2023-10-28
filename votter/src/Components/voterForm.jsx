import React, { useState } from 'react';

function VoterLoginForm() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'black',
    borderRadius: '10px',
    margin:'15px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formGroupStyle = {
    marginBottom: '15px', // Adjust the margin to increase spacing
  };

  const labelStyle = {
    fontWeight: 'bold',
    margin:'6px'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission
  }

  return (
    <div style={formContainerStyle}>
      <h2>Voter Login</h2>
      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="aadharNumber">Aadhar Number</label>
          <input
            type="text"
            id="aadharNumber"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}

export default VoterLoginForm;
