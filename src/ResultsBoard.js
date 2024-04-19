import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import { backend_point } from './consts';

function ResultsBoard() {
  const [forms, setForms] = useState([]);


  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${backend_point}/api/subm_forms/all`);
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
                  See the results
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