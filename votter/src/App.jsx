import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import ErrorPage from './Components/ErrorPage';
import AdminHome from './Components/AdminHome';
import Votersac from './Components/vottersaction';

function App() {

  const [anime, setAnime] = useState({
    blurHome: "blur-home",
    disAdmin: "disable-admin-login-page",
  })
  
  return (
    <div className="App">
        <Router>
        <Navbar vals={{anime, setAnime}}/>
          <Routes>
            <Route exact path="/" element={ <Home vals={{anime, setAnime}}/>}/>
            <Route exact path="/:path" element={ <ErrorPage /> } />
            <Route exact path="/adminHome" element={ <AdminHome /> } />
            <Route exact path="/Votersaction" element={ <Votersac /> } />
          </Routes>
        </Router>
        <Footer />
        
    </div>
  )
}
export default App;
