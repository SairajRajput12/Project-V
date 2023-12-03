// AboutUsPage.js
import React from 'react';
import TeamMember from './TeamMember';
import './TeamInfo.css'; // Import the CSS file
import LightImage from "../Images/Light.jpg"; 
import JohanImage from "../Images/Johan.jpeg"; 
import AyanoKonjiImage from "../Images/COET.jpeg";

const teamMembers = [
  {
    name: 'Sairaj Rajput',
    image: LightImage
  },
  
  {
    name: 'Lord Tushar Kalaskar', 
    image:AyanoKonjiImage
  },
  {
    name: 'Vilas Rabad',
    image:JohanImage
  },
  // Add more team members as needed
];

const TeamInfo = (props) => {
  return (
    <div className="about-us-container">
      <h2 className='component-header'>Meet Our team Members</h2>

      <div className='display-cards'>
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <TeamMember {...member} />
          </div>
        ))}
      </div>
      <br /> 
      <br />
      <h2>Vision</h2>
      <br />
      <p> we believe in a future where every citizen can confidently exercise their right to vote in a secure and efficient manner. Our decentralized application (Dapp) serves as a pioneering solution to address the challenges currently faced in the electoral landscape. By introducing cutting-edge technology, we aim to streamline the voting process, enhance security measures, and safeguard the privacy of every voter.</p>
      <br />
    </div>
  );
};

export default TeamInfo;
