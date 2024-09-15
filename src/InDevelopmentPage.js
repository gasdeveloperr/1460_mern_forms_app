import React from 'react';
import './InDevelopmentPage.css'; // Import the CSS file

const InDevelopmentPage = () => {
  return (
    <div className="development-page">
      <div className="development-page-content">
        This page is in development now
      </div>
      <a href="/" className="development-page-link">
        Go back to the homepage
      </a>
    </div>
  );
};

export default InDevelopmentPage;
