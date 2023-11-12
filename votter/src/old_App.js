import React, { useState } from 'react';
import "./App.css";
import styled from 'styled-components';
import AdminLoginForm from './Components/AdminLoginForm';
// import VoterLoginForm from './Components/voterForm';
import Votersac from './Components/vottersaction';

const Container = styled.div`
  background-color: #001f3f; /* Dark blue background */
  color: white;
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #337ab7; /* Blue background for buttons */
  color: white;
  padding: 20px;
  border: none;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
  width: 500px; /* Adjust the width as needed */
  height: 90px;
  font-size: 28px;
`;

const headerStyle = { fontSize: '30px' };

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showVoterLogin, setShowVoterLogin] = useState(false);
  const [showabutton,setshowabutton] = useState(true);
  const [showvbutton,setshowvbutton] = useState(true); 
  const [showvo,setshowvo] = useState(false); 

  function showadminessentials(){
    setShowAdminLogin(true); 
    setshowvbutton(false); 
  }
  
  function showvoteressentials(){
    setShowVoterLogin(true); 
    setshowabutton(false); 
    setshowvo(true); 
  }


  return (
    <Container>
      <h1 style={headerStyle}>Voting System using Blockchain</h1>
      {showabutton && (
        <Button onClick={showadminessentials}>
        Admin
      </Button>
      )}
      
      {showvbutton && (
        <Button onClick={showvoteressentials}>
          Voter
        </Button>
      )}

      {showAdminLogin && (
        <AdminLoginForm onCancel={() => setShowAdminLogin(false)} />
      )}

      {showvo && (
        <Votersac onCancel={() => setshowvo(false)} />
      )}
    </Container>
  );

}
export default App;
