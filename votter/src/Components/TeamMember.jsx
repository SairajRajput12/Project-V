// TeamMember.js

import React from 'react';

const TeamMember = ({ name, role, bio,image }) => {
  return (
    <div>
      <img src={image} alt={`${name}'s headshot`} className="team-member-image" />
      <h3>{name}</h3>
    </div>
  );
};

export default TeamMember;
