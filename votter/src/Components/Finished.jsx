import React from 'react';
import { useEffect } from 'react';
const Finished = (props) => {
  // props are the input parameter to the login function
  useEffect(() => {
    console.log(props.won);
  }, []); 
  return (
    <div className="login-container">
      <h1 className="welcome-message">Voting is finished</h1>
      <button className="login-button" onClick={props.connectWallet1}>Connect metamask</button>
    </div>
  );
};

export default Finished;
