import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
// import {contractAbi, contractAddress} from './Constant/constant';
import Login from './login'; 
import Finished from './Finished'; 
import Connected from './connected'
// import { address,abi } from '../c'; 
import g from 'E:/Block chain project/votter/src/contractDetails.json'
// import './App.css';

function Votersac() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setremainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const address = g.address; 
  const abi = g.abi; 

  useEffect( () => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });


  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      address,
      abi,
      signer
    );

      const tx = await contractInstance.vote(number);
      await tx.wait();
      canVote();
      console.log('end of  vote function');
  }


  async function canVote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        address,
        abi,
        signer
      );
      const userAddress = await signer.getAddress();
      const voteStatus = await contractInstance.voters(userAddress);
      setCanVote(!voteStatus);
    } catch (error) {
      console.log('Error checking voting status: ' + error.message);
    }
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      address,
      abi,
      signer
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
      console.log('end of  get candidates function');
  }


  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      address,
      abi,
      signer
    );
      const status = await contractInstance.getVotingStatus();
      console.log(status);
      setVotingStatus(status);
      console.log('end of  get current status function');
  }

  async function getRemainingTime() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        address,
        abi,
        signer
      );
      const time = await contractInstance.getRemainingTime();
      setremainingTime(parseInt(time, 16));
      console.log('end of  remaining time function');
  }

  function handleAccountsChanged(accounts) {
    console.log('inside handle accounts changed function'); 
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
    console.log('end of  handle accounts function');
  }

  async function connectToMetamask() {
    console.log('inside connect metamask function');
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
    console.log('end of  connect metamask function');
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      { votingStatus ? (isConnected ? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {remainingTime}
                      number= {number}
                      handleNumberChange = {handleNumberChange}
                      voteFunction = {vote}
                      showButton = {CanVote}/>) 
                      : 
                      (<Login connectWallet = {connectToMetamask}/>)) : (<Finished />)}
      
    </div>
  );



}





export default Votersac;