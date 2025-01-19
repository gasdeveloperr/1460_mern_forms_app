import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { formatDate, getAuthToken, getUserId } from './utils';
import FormResultView from './form_results_components/FormResultView';
import arrow_menu_icon from './icons/arrow-side-menu-icon.svg';
import './ResultsBoardPage.css';
import jsPDF from 'jspdf';
import FormResultsEditing from './form_results_components/FormResultsEditing';

function ResultsBoard() {
  // const [forms, setForms] = useState([]);
  const [submForms, setSubmForms] = useState([]);
  const [currentSubmForms, setCurrentSubmForms] = useState([]);
  const [currentSubmFormName, setCurrentSubmFormName] = useState('');

  const [detailResult, setDetailResult] = useState()
  const [currentVersionResult, setCurrentVersionResult] = useState()
  const [isVersionsDropdown, setIsVersionDropDown] = useState(false)

  const [editingResultMode, setEditingResultMode] = useState(false)

  const [saveWarning, setSaveWarning] = useState(false)

  const handleResultChose = (form) => {
    if(form.versions && form.currentVersion){
      setDetailResult(form);
      setCurrentVersionResult(form.currentVersion)
    }else{
      setDetailResult(form);
    }
  }
  const handleVersionChange = (versionNumber) => {
    setCurrentVersionResult(versionNumber)
    setEditingResultMode(false)
    setSaveWarning(false);
  }

  const toMainBoardHandler = () => {
    setDetailResult()
    setEditingResultMode(false)
    setSaveWarning(false);
  }
  const handleCancelEditing = () => {
    setEditingResultMode(false)
    setSaveWarning(false);
  }
 
  
  const { formId } = useParams();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (formId && submForms.length > 0) {
      const filteredForms = submForms.filter((form) => form.formId === formId);
      setCurrentSubmForms(filteredForms);

      if (filteredForms.length > 0) {
        setCurrentSubmFormName(filteredForms[0].title); // Assuming 'name' is the field in submForms
      }
      setIsLoading(false);
    }
    //console.log('currentSubmForms', currentSubmForms)
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

  const updateForm = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const updatedSubForm = await axios.get(`${backend_point}/api/subm_forms/${detailResult._id}`, config);
      //console.log(' updatedSubForm ', updatedSubForm)
      handleResultChose(updatedSubForm.data);
      setEditingResultMode(false)
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadPDF = () => {
    const formTitle = detailResult.title;
    const input = document.getElementById("result-to-convert");
  
    const elementWidth = input.offsetWidth;
    const elementHeight = input.offsetHeight;
  
    const orientation = elementWidth > '700' ? "l" : "p";
  
    const pdf = new jsPDF(orientation, "mm", "a4");
    pdf.html(input, {
      callback: function (pdf) {
        pdf.save(`${formTitle}.pdf`);
      },
      x: 6,
      y: 4,
      html2canvas: { scale: 0.315 },
    });
  };

  const handleSaveWarning = () => {
    setSaveWarning(true);
  };

  return (
    <div>
      <Header />
      {
        isLoading ?
          <Spinner/>
        : 
        <div className="dashboard-results-body">
          {
          detailResult && !editingResultMode ? 
          <FormResultView form={detailResult} currentVersion={currentVersionResult}
          toMainBoardHandler={toMainBoardHandler} handleDownloadPDF={handleDownloadPDF}
          isVersionsDropdown={isVersionsDropdown} setIsVersionDropDown={setIsVersionDropDown}
          handleVersionChange={handleVersionChange} setEditingResultMode={setEditingResultMode}/>
          :
          detailResult && editingResultMode ? 
          <FormResultsEditing form={detailResult} currentVersion={currentVersionResult}
          toMainBoardHandler={toMainBoardHandler} handleCancelEditing={handleCancelEditing}
          updateForm={updateForm} setIsLoading={setIsLoading}
          saveWarning={saveWarning} handleSaveWarning={handleSaveWarning} handleVersionChange={handleVersionChange}
          isVersionsDropdown={isVersionsDropdown} setIsVersionDropDown={setIsVersionDropDown}/>
          :
          <>
            <div className="results-page-heading">
              <div className="results-page-heading-title">
                <div className="dashboard-page-title">
                  <a href='/forms/dashboard' className="go-back-button" >
                    <img src={arrow_menu_icon} alt="Go Back" />
                  </a>
                  {currentSubmFormName} results
                </div>
              </div>
              <div className='results-page-heading-title-options'>
              </div>
            </div>
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
                          <td className="see-results-button" onClick={() => handleResultChose(form)}>
                            <p>See details</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </>
          }
        </div>
      }
    </div>
  );
}

export default ResultsBoard;