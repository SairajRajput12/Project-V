import React, { useState } from 'react'
import "./AdminHome.css";
import styled from 'styled-components';
import axios from 'axios';
import contractD from '../contractDetails.json'
import { useEffect } from 'react'; 
import { useLocation } from 'react-router-dom';

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
   const location = useLocation();
   const {state} = useLocation(); 
   const [electionName,setElectionName] = useState(); 
   const [election_history,setShowElectionHistory] = useState(false); 
   const [ongoing_election,setShowOnGoingElection] = useState(true);  
   useEffect(() => {
     console.log('AdminHome component rendered');  

     console.log(state)
  // Now you can access the values passed through state
     const admin_id = state ? state.admin_id : null;
     const admin_name = state ? state.admin_name : null;
     const admin_email = state ? state.admin_email : null;

     console.log(admin_id);
     console.log(admin_name);  
     console.log(admin_email);
   }, []);
 
   // let fname, mname, lname, username;
   const [showForm, setShowForm] = useState(false);
   const [isDivVisible, setDivVisibility] = useState(true);
   const [candidates, setCandidates] = useState([
     { id: '', name: '' }, // Removed duration from candidates
   ]);
   const [electionDuration, setElectionDuration] = useState('');
   const [electionData, setElectionData] = useState([]); 
   const [election_history1,set_election_history] = useState([]); 

   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await axios.get('/election_data');
         setElectionData(response.data);
         console.log(electionData);
       } catch (error) {
         console.error('Error fetching election data:', error);
       }
     };

     const fetch_history = async () => {
      try {
        const response = await axios.get('/election_history_data');
        set_election_history(response.data);
        console.log(response.data); 
        console.log('election history',election_history1);
      } catch (error) {
        console.error('Error fetching election data:', error);
      }
     }
     fetchData();
     fetch_history(); 
   }, []);
   
   const handleCreateElection = () => {
     setShowForm(true);
     setDivVisibility(false);
   };
 
   const handleStartElection = (candidateNames, duration,admin_id) => {
     axios
       .post('/start-election', { candidateNames, duration ,electionName,admin_id})
       .then((response) => {
         console.log('Election started:', response.data);
         console.log(contractD);
       })
       .catch((error) => {
         console.error('Error starting election:', error);
       });

      // alert('election has started succesfully');
   };
 
   const handleCreateElection1 = async (e) => {
     e.preventDefault();
     const candidateNames = candidates.map((candidate) => candidate.name);
     const duration = electionDuration;
     const admin_id = state.admin_id; 
     const admin_name = state.admin_name;  
     handleStartElection(candidateNames, duration,admin_id);
     
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

   const changeF = () => {
    console.log('changed'); 
  //  const [election_history,setShowElectionHistory] = useState(false); 
  // const [electionData, setElectionData] = useState([]);  
  // const [ongoing_election,setShowOnGoingElection] = useState(true);   
    if(ongoing_election === true){
        setShowOnGoingElection(false); 
        setShowElectionHistory(true); 
    }
    else{
        setShowElectionHistory(false); 
        setShowOnGoingElection(true); 
    }
   }
 

   return (
      <div className="admin-home">
         <div className="admin-details flex rel ali-cent">
            <img src={ require("../Images/user.png") } alt="" />
            <div className="details">
               <div className="name">@{state.admin_email}</div>
               <div className="user">
                  <span>{state.admin_name}</span>
                  <br />
                  <span>Admin Id: {state.admin_id}</span>
               </div>
            </div>
         </div>
         <div className="election rel visibality">
            <div className="new">

               <div className="cards flex">
                  <div onClick ={changeF} className="card flex ali-cent just-cent">
                     <span>History</span>
                  </div>
                  <div onClick={changeF} className="card flex ali-cent just-cent">
                     <span>On Going Election</span>
                  </div>
               </div>
               {ongoing_election && (
                  <div className="ongoing-ele">
                  <span>On Going Election</span>
                  <div className="ele-details">
                  <h2>Election Data</h2>
                  <table className="election-table">
                     <thead>
                        <tr>
                           <th>Election ID</th>
                           <th>Start</th>
                           <th>End</th>
                           <th>Election Name</th>
                        </tr>
                     </thead>
                     <tbody>
                        {electionData.map((election, index) => (
                           <tr key={index}>
                           <td>{election[0]}</td>
                           <td>{election[1]}</td>
                           <td>{election[2]}</td>
                           <td>{election[3]}</td>
                           </tr>
                        ))}
                     </tbody>
                     </table>

                  </div>
               </div>
                  )}

          {election_history && (
                  <div className="ongoing-ele">
                  <span>On Going Election</span>
                  <div className="ele-details">
                  <h2>Election History</h2>
                  <table className="election-table">
                     <thead>
                        <tr>
                           <th>election name</th>
                           <th>conducted by admin id</th>
                           <th>winner</th>
                           <th>election id</th>
                        </tr>
                     </thead>
                     <tbody>
                        {election_history1.map((election, index) => (
                           <tr key={index}>
                           <td>{election[0]}</td>
                           <td>{election[1]}</td>
                           <td>{election[2]}</td>
                           <td>{election[3]}</td>
                           </tr>
                        ))}
                     </tbody>
                     </table>

                  </div>
               </div>

              )}
            </div>
            <br />
            <br />
            <div className="creating">
               <button><i class='bx bx-arrow-back'></i></button>
               {/* <h1 style={ headerStyle }></h1> */}

               { showForm ? (
                  <Form style={formContainerStyle}>
                  <label style={labelStyle}>Election Name:</label>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Enter election name"
                    value={electionName}
                    onChange={(e) => setElectionName(e.target.value)}
                  />
                
                  <label style={labelStyle}>Election Duration:</label>
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="Enter duration"
                    value={electionDuration}
                    onChange={(e) => setElectionDuration(e.target.value)}
                  />
                
                  {candidates.map((candidate, index) => (
                    <div key={index}>
                      <label style={labelStyle}>Candidate ID:</label>
                      <input
                        style={inputStyle}
                        type="text"
                        placeholder="Enter candidate ID"
                        value={candidate.id}
                        onChange={(e) => handleCandidateChange(index, 'id', e.target.value)}
                      />
                
                      <label style={labelStyle}>Candidate Name:</label>
                      <input
                        style={inputStyle}
                        type="text"
                        placeholder="Enter candidate name"
                        value={candidate.name}
                        onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      />
                    </div>
                  ))}
                
                  <button style={buttonStyle} onClick={handleCreateElection1}>
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

export default AdminHome;