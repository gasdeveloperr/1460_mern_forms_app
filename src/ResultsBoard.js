import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { getAuthToken } from './utils';

function ResultsBoard() {
  const [forms, setForms] = useState([]);
  const [submForms, setSubmForms] = useState([]);
  const [results, setResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    const fetchData = async () => {
      try {
        // Fetch all forms
        const formsResponse = await axios.get(`${backend_point}/api/forms/all`, config);
        setForms(formsResponse.data);

        // Fetch all subm_forms
        const submFormsResponse = await axios.get(`${backend_point}/api/subm_forms/all`, config);
        setSubmForms(submFormsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    setIsLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if(submForms && forms){
      // Create a map of formId to subm_forms for efficient lookup
      const submFormsMap = submForms.reduce((map, submForm) => {
        const { formId } = submForm;
        if (!map[formId]) {
          map[formId] = [];
        }
        map[formId].push(submForm);
        return map;
      }, {});
  
      // Build the results array
      const resultsData = forms.map((form) => ({
        title: form.title,
        formId: form._id,
        subm_forms: submFormsMap[form._id] || [],
      }));
      console.log('resultsData: ', resultsData)
      setResults(resultsData);
      setIsLoading(false);
    }
  }, [submForms, forms])


  return (
    <div>
      <Header />
      <div className="dashboard-body">
        <div className="dashboard-page-heading">
          <div className="dashboard-page-title">
            Welcome to Results board
          </div>
        </div>
        <div className="dashboard-page-content">
          {
            isLoading ?
              <Spinner/>
            :  
            <div className="results-dashboard-list">
              {results.length !== 0 ?
                  results.map((result) => (
                    <div className="results-list-item" key={result.formId}>
                      <div className="results-list-item-title">
                        {result.title}
                      </div>
                      <div className="results-list-item-propety">
                        Amount of submit: {result.subm_forms.length}
                      </div>
                      <div className="form-actions">
                        <a href={`/forms/builder/${result.formId}`} className="edit">
                          Edit form
                        </a>
                      </div>
                    </div>
                  ))
                :
                <div>There are no results yet</div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default ResultsBoard;