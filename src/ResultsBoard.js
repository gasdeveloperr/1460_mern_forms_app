import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

function ResultsBoard() {
  const [forms, setForms] = useState([]);

  const backend_point = 'https://one460-forms-backend.onrender.com'
  //'http://localhost:8000'
  //'https://one460-forms-backend.onrender.com:10000'

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${backend_point}/api/forms/all`);
        setForms(response.data);
      } catch (err) {
        console.error('Error fetching forms:', err);
      }
    };

    fetchForms();
  }, []);

  return (
    <div>
      <Header />
      <div className="dashboard-page-heading">
        <div className="dashboard-page-title">
          Welcome to Results board
        </div>
      </div>
      <div className="dashboard-page-content">
        <div className="dashboard-form-list">
          {forms.map((form) => (
            <div className="form-list-item" key={form.id}>
              {form.title}
              <div className="form-actions">
                <a href={`/forms/builder/${form._id}`} className="edit">
                  Edit
                </a>
                <a href={`/forms/live/${form._id}`} className="fill">
                  Use
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultsBoard;