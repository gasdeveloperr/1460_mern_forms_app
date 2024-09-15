import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Import the CSS file

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message">The requested page does not exist.</p>
      <Link to="/" className="not-found-link">Go back to the homepage</Link>
    </div>
  );
};

export default NotFoundPage;
