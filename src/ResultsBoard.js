import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { formatDate, getAuthToken } from './utils';
import FormResultView from './form_results_components/FormResultView';
import arrow_menu_icon from './icons/arrow-side-menu-icon.svg';

function ResultsBoard() {
  // const [forms, setForms] = useState([]);
  const [submForms, setSubmForms] = useState([]);
  const [currentSubmForms, setCurrentSubmForms] = useState([]);
  const [currentSubmFormName, setCurrentSubmFormName] = useState('');

  const [detailResult, setDetailResult] = useState()

  
  const toMainBoardHandler = () => {
    setDetailResult()
  }

  
  const { formId } = useParams();

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(formId){

    }
  }, [])

  useEffect(() => {
    if (formId && submForms.length > 0) {
      const filteredForms = submForms.filter((form) => form.formId === formId);
      setCurrentSubmForms(filteredForms);

      if (filteredForms.length > 0) {
        setCurrentSubmFormName(filteredForms[0].title); // Assuming 'name' is the field in submForms
      }

      setIsLoading(false);
    }
    console.log('currentSubmForms', currentSubmForms)
  }, [submForms])

  useEffect(() => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    const fetchData = async () => {
      try {
        const submFormsResponse = await axios.get(`${backend_point}/api/subm_forms/all`, config);
        setSubmForms(submFormsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    setIsLoading(true);
    fetchData();
  }, []);

  // useEffect(() => {
  //   if(submForms && forms){
  //     // Create a map of formId to subm_forms for efficient lookup
  //     const submFormsMap = submForms.reduce((map, submForm) => {
  //       const { formId } = submForm;
  //       if (!map[formId]) {
  //         map[formId] = [];
  //       }
  //       map[formId].push(submForm);
  //       return map;
  //     }, {});
  
  //     // Build the results array
  //     const resultsData = forms.map((form) => ({
  //       title: form.title,
  //       formId: form._id,
  //       subm_forms: submFormsMap[form._id] || [],
  //     }));
  //     console.log('resultsData: ', resultsData)
  //     setResults(resultsData);
  //     setIsLoading(false);
  //   }
  // }, [submForms, forms])


  return (
    <div>
      <Header />
      {
        isLoading ?
          <Spinner/>
        : 
        <div className="dashboard-body">
          <div className="dashboard-page-heading">
            <div className="dashboard-page-title">
              <a href='/forms/dashboard' className="go-back-button" >
                <img src={arrow_menu_icon} alt="Go Back" />
              </a>
              {currentSubmFormName} results
            </div>
          </div>
          {detailResult ? 
          <FormResultView form={detailResult} goBack={toMainBoardHandler}/>
          :
          <div className="dashboard-page-content"> 
              <div className="clients-table-container">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Submitted by</th>
                      <th>Submitted time</th>
                      <th>Results</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubmForms.map((form, formIndex) => (
                      <tr key={`${form._id}`}>
                        <td className="form-index">
                          {formIndex+1}.
                        </td>
                        <td>
                          {form.submittedBy.email}
                        </td>
                        <td className="client-index">
                          {formatDate(form.submittedAt)}
                        </td>
                        <td className="client-index" onClick={() => setDetailResult(form)}>
                          See details
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>}
        </div>
      }
    </div>
  );
}

export default ResultsBoard;

 {/* // <div className="results-dashboard-list">
              //   {currentSubmForms.length !== 0 ?
              //       currentSubmForms.map((formResult) => (
              //         <div className="results-list-item" key={formResult.formId}>
              //           <div className="results-list-item-title">
              //             {formResult.title}
              //           </div>
              //           <div className="results-list-item-propety">
              //             Amount of submit: {formResult.subm_forms.length}
              //           </div>
              //           <div className="form-actions">
              //             <a href={`/forms/builder/${formResult.formId}`} className="edit">
              //               Edit form
              //             </a>
              //           </div>
              //         </div>
              //       ))
              //     :
              //     <div>There are no results yet</div>
              //   }
              // </div> */}