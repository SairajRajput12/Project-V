import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Home.css";
import votImage from "../Images/voting-box.png";

function Home(props) {

  const Navigate = useNavigate();
  const [counter, setCounter] = useState(30);
  const [hide, setHide] = useState("hide");
  const [otpBtn, setOtpBtn] = useState("visible");
  const [disabled, setDisable] = useState("");

  const [gotToLogin, setGoToLogin] = useState("");
  function showLoginPage() {
    setGoToLogin("visible");
  }
  function hideLogin() {
    setGoToLogin("");
  }

  function hideAdminLogin() {
    props.vals.setAnime({
      blurHome: "blur-home",
      disAdmin: "disable-admin-login-page",
    })
  }

  //**************AADHAR AUTHENTICATION ***********/
  let name, value;
  const [userData, setUserData] = useState({
    adhar: "",
    otp: ""
  })

  const userInput = (e)=>{
    name = e.target.name;
    value = e.target.value;
    setUserData({...userData, [name]:value});
  }

  // Wait untill timer is get === 0
  useEffect(()=>{
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if(counter === 0) {
      setOtpBtn("visible");
      setHide("hide");
      setDisable("");
    }
  },[counter]);

  const postAdhar = async (e)=>{
    e.preventDefault();
    const adhar = userData.adhar;
    // console.log(adhar);

    if(adhar === "" || adhar.length > 12){
      window.alert("Wrong Information");
    }
    else{
      setOtpBtn("hide");
      setCounter(30);
      setDisable("disabled");
      setHide("visible");
      const res = await fetch("/adharVerify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adhar:adhar
        })
      });
      const data = await res.json();
      if(data.status === 200){
        window.alert("OTP Sent Successfully on Mobile Number Linked with AADHAR Number!");
      }
      else if(data.status === 400){
        window.alert("Something Wrong");
      }
      else{
        window.alert("server ERROR!");
      }
    }
  }

  /************ Verifying OTP ************/
  const verifyOtp = async(e)=>{
    e.preventDefault();
    const otp = userData.otp;
    // console.log(adhar);

    const res = await fetch("/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        otp:otp
      })
    });

    const data = await res.json();
    if(data.status === 200){
      window.alert("OTP Verified Successfully!");
      Navigate("/Votersaction");
    }
    else if(data.status === 403){
      window.alert("INVALID OTP");
    }
    else{
      window.alert("Server ERROR");
    }
  }


  //****** Post Data to server ----> for Login *******/

   const [loginUser, setLoginUser] = useState({
      username: "",
      password: ""
   })

   const loginInput = (e)=>{
      name = e.target.name;
      value = e.target.value;
      setLoginUser({...loginUser, [name]:value});
   }


  const loginPost = async(e) =>{
    e.preventDefault();
    const {username, password} = loginUser;
    // console.log(email);
    // console.log(password);

    const res = await fetch("/verify", {
       method: "POST",
       headers: {
          "Content-Type": "application/json"
       },
       body: JSON.stringify({
          username, password
       })
    });
 
    const data = await res.json();
    // console.log(data);

    if(data.code === 403){
       window.alert("Invalid Credentials!");
       console.log("invalid Credentials!");
    }
    else{
      //  window.alert("Login Successfuly");
       Navigate("/adminHome");
    }
 }

  return (
    <>
      <div className={ `${props.vals.anime.blurHome} home flex` } id="home">
        <div className="content flex">
          <div className="Scroll flex ali-cent">
            <div className="cont cont1 flex ali-cent just-cent">
              <img src={ require("../Images/security.png") } alt="" />
              <span>Blockchain voting systems are secure due to their decentralized nature, making it challenging for any single entity to manipulate or tamper with the data.</span>
            </div>
            <div className="cont cont2 flex ali-cent just-cent">
              <img src={ require("../Images/decentralized.png") } alt="" />
              <span>A blockchain voting system has decentralized by distributing the voting process across a network of nodes or participants, eliminating the need for a centralized authority. </span>
            </div>
            <div className="cont cont3 flex ali-cent just-cent">
              <img src={ require("../Images/blockchain.png") } alt="" />
              <span> Immutability: Once recorded, votes are permanent and cannot be changed, ensuring the integrity of the election.</span>
            </div>
            <div className="cont cont4 flex ali-cent just-cent">
              <img src={ require("../Images/id.png") } alt="" />
              <span> Verification: Voters can verify that their vote has been accurately recorded and counted on the blockchain.</span>
            </div>
          </div>
          <div className="Circle abs"></div>
        </div>
        <div className="landing">
          <div className="user-login flex abs ali-cent just-cent">
            <img src={ votImage } alt="" />
            <span className="election">Election Is Going On</span>
            <span className="vote">Lets Vote !</span>
            <div className="btns rel">
              <button className="button but1" onClick={ showLoginPage }>Vote</button>
              <button className="button but2">Know Security <i className='bx bx-right-arrow-alt' ></i></button>
            </div>
          </div>
          <div className={ `${gotToLogin} auth user-login flex abs ali-cent just-cent` }>
            <div className="form">
              <form method="POST" >
                <div className="adhar flex">
                  <label htmlFor="adhar">Aadhar Card No.:</label>
                  <input type="text" disabled={disabled} name="adhar" onChange={userInput}/>
                </div>
                <div className="otpBtn">
                  <button type="button" className={otpBtn} onClick={postAdhar}>Generate OTP</button>
                </div>
                <div className="otpBtn">
                  <button type="button" className={hide} >Send in 00:{counter}</button>
                </div>
                <div className="adhar flex">
                  <label htmlFor="otp">OTP:</label>
                  <input type="text" name="otp" onChange={userInput} />
                </div>
                <button className="login" onClick={verifyOtp}>Log In</button>
                <div className="back">
                  <i onClick={ hideLogin } className='abs bx bx-arrow-back'></i>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={ `${props.vals.anime.disAdmin} admin-login abs` }>
        <h2 className="adminLogin">Admin Login</h2>
        <form method="POST">
          <div className="adhar flex">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" autocomplete="off" onChange={loginInput} required="required"/>
          </div>
          <div className="adhar flex">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" onChange={loginInput} required="required"/>
          </div>
          <button className="login" type="submit" onClick={loginPost}>Log In</button>
          <div className="back">
            <i onClick={ hideAdminLogin} className='abs bx bx-arrow-back'></i>
          </div>
        </form>
      </div>
    </>
  )
}

export default Home
