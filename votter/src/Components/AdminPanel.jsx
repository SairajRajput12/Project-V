import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import contractD from '../contractDetails.json'

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

function AdminPanel(props) {
  const [showForm, setShowForm] = useState(false);
  const [candidates, setCandidates] = useState([
    { id: '', name: '', duration: '' }, // Initial empty candidate
  ]);
  const [electionDuration, setElectionDuration] = useState(''); // Added duration state for the election
  const Navigate = useNavigate();

  const handleCreateElection = () => {
    setShowForm(true);
  };

  const handleStartElection = (candidateNames, duration) => {
    axios
      .post('/start-election', { candidateNames, duration })
      .then((response) => {
        console.log('Election started:', response.data);
        console.log(contractD); 
        Navigate("/");

      })
      .catch((error) => {
        console.error('Error starting election:', error);
      });
  };

  const handleCreateElection1 = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const candidateNames = candidates; // Replace with your candidate names
    const duration = 23; // Replace with your desired duration
    handleStartElection(candidateNames, duration);    
  };
  

  const handleAddCandidate = () => {
    setCandidates((prevCandidates) => [
      ...prevCandidates,
      { id: '', name: '', duration: '' }, // Add a new empty candidate
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
    <Container>
      <h1 style={headerStyle}>This is admin panel</h1>

      {showForm ? (
        <Form style={formContainerStyle}>
          <label style={labelStyle}>Election Duration (in days):</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="Enter duration (in days)"
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
        <Button onClick={handleCreateElection}>Create Election</Button>
      )}

      <Button onClick={handleAddCandidate}>Add Candidate</Button>
    </Container>
  );
}

export default AdminPanel;
