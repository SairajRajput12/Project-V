// import React, {useContext} from 'react'
import React from "react";
import "./Navbar.css"
// import Login_anime from '../contexts/login_anime'

function Navbar(props) {

  // const context = useContext(Login_anime);
  function changeData() {
    props.vals.setAnime({
      blurHome: "",
      disAdmin: ""
    })
  }

  return (
    <div className="nav flex ali-cent abs">
      <span className="title">Vote.me</span>
      <div className="list flex ali-cent">
        <ul className="flexs">
          <li>Home</li>
        </ul>
        <button className="button rel" onClick={changeData}>Admin Login</button>
      </div>
    </div>
  )
}

export default Navbar
