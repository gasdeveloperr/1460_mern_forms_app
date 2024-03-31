import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'

function DashboardPage() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const backend_point = 'https://one460-forms-backend.onrender.com'
  //'http://localhost:8000'
  //'https://one460-forms-backend.onrender.com'

  
  const fetchForms = async () => {
    try {
      const response = await axios.get(`${backend_point}/api/forms/all`);
      setIsLoading(false);
      setForms(response.data);
    } catch (err) {
      setIsError('Error fetching form, please refresh the page')
      console.error('Error fetching forms:', err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchForms();
  }, []);

  const deleteFormHandler = async (formId) => {
    try {
      const response = await axios.delete(`${backend_point}/api/forms/${formId}`);
      
      if (response.status === 200) {
        // Delete request was successful
        fetchForms();
      } else {
        // Handle other response statuses if needed
        setIsError('Error deleting a form, please refresh the page');
      }
    } catch (err) {
      setIsError('Error deleting a form, please refresh the page');
      console.error('Error deleting forms:', err);
    }
  };

  return (
    <div>
      <Header />
      <div className="dashboard-page-heading">
        <div className="dashboard-page-title">
          Welcome to Dashboard
        </div>
        <Link to="/forms/builder/new" className="new-form-btn">
          Create new Form
        </Link>
        </div>
      <div className="dashboard-page-content">
        <div className="dashboard-form-list">
          {
            isLoading ?
              <Spinner/>
            :  
            isError ?
            <div className='error-message' >
              {isError}
            </div>
            :
            forms.map((form) => (
              <div className="form-list-item" key={form.id}>
                {form.title}
                <div className="form-actions">
                  <a href={`/forms/builder/${form._id}`} className="edit">
                    Edit
                  </a>
                  <a href={`/forms/live/${form._id}`} className="fill">
                    Use
                  </a>
                  <div className="delete" onClick={() => deleteFormHandler(form._id)}>
                    <img src={trash_icon} className="remove-icon"/>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;