import React from 'react';

const Finished = (props) => {
  // props are the input parameter to the login function
  return (
    <div className="login-container">
      <h1 className="welcome-message">Voting is finished</h1>
      <button className="login-button" onClick={props.connectWallet}>Connect metamask</button>
    </div>
  );
};

export default Finished;
