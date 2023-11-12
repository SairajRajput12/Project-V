import React from 'react'
import "./Footer.css";

function Footer() {
  return (
    <div className="footer flex">
      <div className="side1">
         <span className="title">Vote.me	&#169;</span>
         <h3>About Us</h3>
         <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis, doloribus! Asperiores unde ipsa qui soluta. Totam reiciendis libero voluptate ad! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias mollitia facilis voluptas incidunt dolore!</p>
      </div>
      <div className="side2">
         <h3>Contact US</h3>
         <div className="clist">
            <i className='bx bxl-twitter'  ></i>
            <i className='bx bxl-instagram-alt'></i>
            <i className='bx bxl-linkedin-square'  ></i>
            <i className='bx bxl-facebook-square'  ></i>
            <span>Phone No.: +91 7387410XXX</span>
         </div>
         <p className="email">Email: voteme.support23913@vote.com</p>
         <span>All Rights are Reserved!</span>
      </div>
    </div>
  )
}

export default Footer
