import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

function DashboardPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/forms/all');
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
          Welcome to Forms Dashboard
        </div>
        <Link to="/forms/builder" className="new-form-btn">
          Create Form
        </Link>
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
                <a href={`/forms/fill/${form._id}`} className="fill">
                  Fill
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;