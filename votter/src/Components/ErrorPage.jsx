import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
   return (
      <div className="error rel flex">
         <h1>404</h1>
         <p>Sorry, Page Not Found!</p>
         <Link to="/" className="link">
            <button className="go-home">Go Home</button>
         </Link>
      </div>
   )
}

export default ErrorPage
