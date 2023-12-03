import React, {useState} from 'react'; 
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import ErrorPage from './Components/ErrorPage';
import AdminHome from './Components/AdminHome';
import Votersac from './Components/vottersaction'; 
import TeamInfo from './Components/TeamInfo';

function App() {
  const [currentPath,setPath] = useState(window.location.pathname); 
  const [anime, setAnime] = useState({
    blurHome: "blur-home",
    disAdmin: "disable-admin-login-page",
  })
  const [showInfo, setShowInfo] = useState(true);  
  // const location = useLocation();
  useEffect(() => {
    // Access the current path location
    if(window.location.pathname === '/'){
      setPath(window.location.pathname); 
      setShowInfo(true); 
    } 
    else{
      setShowInfo(false); 
    }
    console.log('Current Path:', currentPath);
  }, []);

  return (
    <div className="App">
        <Router>
        <Navbar vals={{anime, setAnime}}/>
          <Routes>
            <Route exact path="/" element={<Home vals={{ anime, setAnime }} showInfo={showInfo} setShowInfo={setShowInfo} />} />
            <Route exact path="/:path" element={ <ErrorPage /> } />
            <Route exact path="/adminHome" element={ <AdminHome /> } />
            <Route exact path="/Votersaction" element={ <Votersac /> } /> 
          </Routes>
        </Router>
        <br />
        <br />
        {showInfo && <TeamInfo />}
        <br />
        <br />
        <Footer />
        
    </div>
  )
}
export default App;
