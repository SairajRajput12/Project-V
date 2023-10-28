import React from 'react';

const Connected = (props) => {
  // props are the input parameter to the login function
  return (
    <div className="connected-container">
      <h1 className="connected-header">You are connected to metamask</h1>
      <p className="connected-account">Metamask account : {props.account}</p>
      <p className="connected-account">Reamaining time : {props.remainingTime}</p>
      {props.showButton ? (
        <p className='connected-account'>you have already voted {props.account}</p>
      ) : (
        <div>
        <input type="number" placeholder='enter the candidate index' value = {props.number} onChange={props.handleNumberChange}/> 
        <button className="login-button" onClick={props.voteFunction}>Vote here</button>
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

    </div>
  );
};

export default Connected;
