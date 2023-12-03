import React, { useEffect, useState } from 'react';

const Connected = (props) => {
  const [localData, setLocalData] = useState([]);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedData = localStorage.getItem('votingData');
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
  }, []);

  // Save data to localStorage whenever props.data changes
  useEffect(() => {
    const newData = props.data || {};
    localStorage.setItem('votingData', JSON.stringify(newData));
    setLocalData(newData);
  }, [props.data]);

  return (
    <div className="connected-container">
      <h1 className="connected-header">You are connected to MetaMask</h1>
      <p className="connected-account">MetaMask account: {props.account}</p>
      <p className="connected-account">Remaining time: {props.remainingTime}</p>
      {props.showButton ? (
        <p className='connected-account'>You have already voted {props.account}</p>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter the candidate index"
            value={props.number}
            onChange={props.handleNumberChange}
          />
          <button className="login-button" onClick={props.voteFunction}>
            Vote here
          </button>
        </div>
      )}

      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate name</th>
            <th>Candidate votes</th>
          </tr>
        </thead>
        <tbody>
          {props.candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.showVotingTable && (
        <table id="votedTable">
          <thead>
            <tr>
              <th>Voter</th>
              <th>Voted to</th>
            </tr>
          </thead>
          <tbody>
            {props.voter_id.map((voterId, index) => (
              <tr key={index}>
                <td>{voterId}</td>
                <td>{props.candidate_name[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Connected;