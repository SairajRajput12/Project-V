import React, { useState } from 'react'
import "./AdminHome.css";
import styled from 'styled-components';
import axios from 'axios';
import contractD from '../contractDetails.json'
import { useEffect } from 'react';
const Container = styled.div`
  background-color: #001f3f;
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
  background-color: #337ab7;
  color: white;
  padding: 20px;
  border: none;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
  width: 500px;
  height: 90px;
  font-size: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const formContainerStyle = {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   padding: '20px',
   backgroundColor: 'black',
   borderRadius: '10px',
   marginBottom: '30px',
};

const labelStyle = {
   fontWeight: 'bold',
   padding: '6px',
};

const inputStyle = {
   padding: '8px',
   border: '1px solid #ccc',
   borderRadius: '5px',
   margin: '6px',
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

const headerStyle = { fontSize: '30px' };


function AdminHome() {
   useEffect(() => {
     console.log('AdminHome component rendered');
   }, []);
 
   // let fname, mname, lname, username;
   const [showForm, setShowForm] = useState(false);
   const [isDivVisible, setDivVisibility] = useState(true);
   const [candidates, setCandidates] = useState([
     { id: '', name: '' }, // Removed duration from candidates
   ]);
   const [electionDuration, setElectionDuration] = useState('');
 
   const handleCreateElection = () => {
     setShowForm(true);
     setDivVisibility(false);
   };
 
   const handleStartElection = (candidateNames, duration) => {
     axios
       .post('/start-election', { candidateNames, duration })
       .then((response) => {
         console.log('Election started:', response.data);
         console.log(contractD);
       })
       .catch((error) => {
         console.error('Error starting election:', error);
       });
   };
 
   const handleCreateElection1 = async (e) => {
     e.preventDefault();
     const candidateNames = candidates.map((candidate) => candidate.name);
     const duration = electionDuration;
     handleStartElection(candidateNames, duration);
   };
 
   const handleAddCandidate = () => {
     setCandidates((prevCandidates) => [
       ...prevCandidates,
       { id: '', name: '' },
     ]);
   };
 
   const handleCandidateChange = (index, field, value) => {
     setCandidates((prevCandidates) => {
       const updatedCandidates = [...prevCandidates];
       updatedCandidates[index][field] = value;
       return updatedCandidates;
     });
   };
 

   return (
      <div className="admin-home">
         <div className="admin-details flex rel ali-cent">
            <img src={ require("../Images/user.png") } alt="" />
            <div className="details">
               <div className="name">@sairajrajput</div>
               <div className="user">
                  <span>Sairaj</span>
                  <span>Prakash</span>
                  <span>Rajput</span>
               </div>
            </div>
         </div>
         <div className="election rel visibality">
            <div className="new">

               <div className="cards flex">
                  <div className="card flex ali-cent just-cent">
                     <span>Start New Election</span>
                  </div>
                  <div className="card flex ali-cent just-cent">
                     <span>History</span>
                  </div>
               </div>
               {isDivVisible && (
                  <div className="ongoing-ele">
                  <span>On Going Election</span>
                  <div className="ele-details">
                     <span className="abs not-found">No Record</span>
                  </div>
               </div>
                  )}
            </div>
            <div className="creating">
               <button><i class='bx bx-arrow-back'></i></button>
               <h1 style={ headerStyle }>This is admin panel</h1>

               { showForm ? (
                  <Form style={ formContainerStyle }>
                     <label style={ labelStyle }>Election Duration (in days):</label>
                     <input
                        style={ inputStyle }
                        type="number"
                        placeholder="Enter duration (in days)"
                        value={ electionDuration }
                        onChange={ (e) => setElectionDuration(e.target.value) }
                     />
                     { candidates.map((candidate, index) => (
                        <div key={ index }>
                           <label style={ labelStyle }>Candidate ID:</label>
                           <input
                              style={ inputStyle }
                              type="text"
                              placeholder="Enter candidate ID"
                              value={ candidate.id }
                              onChange={ (e) => handleCandidateChange(index, 'id', e.target.value) }
                           />
                           <label style={ labelStyle }>Candidate Name:</label>
                           <input
                              style={ inputStyle }
                              type="text"
                              placeholder="Enter candidate name"
                              value={ candidate.name }
                              onChange={ (e) => handleCandidateChange(index, 'name', e.target.value) }
                           />

                        </div>
                     )) }
                     <button style={ buttonStyle } onClick={ handleCreateElection1 }>
                        Start Election
                     </button>
                  </Form>
               ) : (
                  <Button onClick={ handleCreateElection }>Create Election</Button>
               ) }

               <Button onClick={ handleAddCandidate }>Add Candidate</Button>
            </div>
         </div>
      </div>
   )
}

export default AdminHome
