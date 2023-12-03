import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
// import {contractAbi, contractAddress} from './Constant/constant';
import Login from './login'; 
import Connected from './connected'; 
import Finished from './Finished';
// import './App.css';
import k from '../contractDetails.json'
import { useLocation } from 'react-router-dom';

function Votersac() { 
  const contractAddress = k.address; 
  const contractAbi = k.abi;  
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setremainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const [winner,setWinner] = useState(''); 
  const [voteCount,setCount] = useState(0);
  const [finit,setfini] = useState(false);
  const {state} = useLocation();
  const [rec, setRec] = useState([]);
  const [votted, setVotted] = useState([]); 
  const [candidate_name,setcandidate_names] = useState([]); 
  const [voter_id,setvoterid] = useState([]); 
  const [votedData, setVotedData] = useState({ id: '', candidate: '', voted_to: '' });
  const [showVotingTable,setshowVotingTable] = useState(false);
  // const {aadhar} = state; 
  useEffect(() => {
    const fetchData = async () => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    postData();
    console.log(rec); 
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    console.log(candidate_name) 
    console.log(votted)
    await connectToMetamask();

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    };

    fetchData();
  }, []); 

  
  async function postData() {
    try {
      const response = await fetch("/fetch_voted_data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(response.message);
      console.log(response);
      console.log(data)
      console.log(data.candidate_names); 
      console.log(data.voter_ids);
      setshowVotingTable(true);
      setcandidate_names(data.candidate_names);
      setvoterid(data.voter_ids);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  async function vote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
  
      const tx = await contractInstance.vote(number);
      await tx.wait();
  
      // now posting the data 
      const res = await fetch("/register_transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          candidate: candidates[number],
          id: state.aadhar
        })
      });
      postData(); 
      setshowVotingTable(true);
  
      if (res.ok) {
        const data = await res.json();
        const voterHashedId = data.voter_hashed_id;
  
        // Set the votedData state
        const votedData = {
          id: state.aadhar,
          candidate: candidates[number].name,
          voted_to: voterHashedId
        };
  
        setVotedData(votedData);
  
        // Update state with the new data
        setRec([...rec, votedData]);
        setVotted([...votted, voterHashedId]);
        canVote();
  
        // Update local storage
        const newLocalData = {
          id: voterHashedId,
          candidate: candidates[number].name,
          voted_to: votedData.voted_to
        };
  
        const localData = JSON.parse(localStorage.getItem('votedData')) || [];
        localData.push(votedData);
        localStorage.setItem('votedData', JSON.stringify(localData));
        
      } else {
        console.error("Error recording transaction:", res.statusText);
        // Handle error as needed
      }
      canVote();
    } catch (error) {
      console.error("Error voting:", error);
      // Handle error as needed
    }
  }
  


  async function canVote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(voteStatus);

  }

  async function getCandidates() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        }
      });
      setCandidates(formattedCandidates);
  }


  async function getCurrentStatus() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const status = await contractInstance.getVotingStatus();
      console.log(status);
      setVotingStatus(status);
  }

  async function getRemainingTime() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const time = await contractInstance.getRemainingTime(); 
      console.log(time.toNumber()); 
      if(time.toNumber() === 0){
        console.log('function has invoked')
        getWinner(); 
      }
      setremainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
      alert("connect your metamask first");
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
        console.log('Metamask is detected');
        // window.ethereum.on('accountsChanged', handleAccountsChanged);
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (accounts.length > 0) {
                console.log("Yes, Metamask is connected");
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(provider);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);
                    console.log("Metamask Connected: " + address);
                    setIsConnected(true);
                    canVote();
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert("Sir, please connect Metamask");
            }
        } catch (error) {
            console.error("Error connecting to Metamask:", error);
        }
    } else {
        console.error("Metamask is not detected in the browser");
    }
}


  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  async function getWinner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const participants = await contractInstance.getAllVotesOfCandiates();
    const formattedData = participants.map((candidate) => ({
      name: candidate[0], // Access the first element as the candidate's name
      voteCount: candidate[1].toNumber(),
    }));
  
    console.log(formattedData);
  
      const maxVoteCountCandidate = formattedData.reduce(
        (max, candidate) =>
          max.voteCount > candidate.voteCount ? max : candidate
      );
      console.log(maxVoteCountCandidate);
      setWinner(maxVoteCountCandidate.name);
      setCount(maxVoteCountCandidate.voteCount);
      setfini(true);
    
  }
  
  

  return (
    <div className="App">
            {/* ... (other JSX) */}
            {votingStatus ? (isConnected ? (
                <Connected
                    account={account}
                    candidates={candidates}
                    remainingTime={remainingTime}
                    number={number}
                    handleNumberChange={handleNumberChange}
                    voteFunction={vote}
                    showButton={CanVote}
                    r={rec}
                    vo={votted}
                    data={votedData} 
                    showVotingTable = {showVotingTable} 
                    candidate_name = {candidate_name}
                    voter_id={voter_id}

                />
            ) : (
                <Login connectWallet={connectToMetamask} />
            )) : (
                <Finished remainingTime={remainingTime} connectWallet1={connectToMetamask} won={winner} />
            )}

            {finit && (
                <h1>The winner of this election is {winner}</h1>
            )}
        </div>
  );

}
export default Votersac;
// const [candidate_name,setcandidate_names] = useState([]); 
  // const [voter_id,setvoterid] = useState([]);