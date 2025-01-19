import React, { useEffect, useState } from 'react';
import { formatDate } from '../utils';
import dropdown_icon from '../icons/dropdown-icon.svg';

const FormSubmissionRow = ({ form, isSelected, onSelectSubmission, onVersionChange }) => {
  
  const [isVersionsDropdownUnic, setIsVersionDropDownUnic] = useState('');
  const [currentVersionUnic, setCurrentVersionUnic] = useState();

  const handleChange = (versionNumber) => {
    setCurrentVersionUnic(versionNumber)
    onVersionChange(versionNumber)
    setIsVersionDropDownUnic(false)
  }

  return (
    <tr key={`${form._id}`}>
      <td className="radio-index">
        <label className='form-component-radio-container submission-radio-label'>
          <input 
            type="radio" 
            name=""
            checked={isSelected}
            onChange={() => onSelectSubmission(form)}
          />
          <span className="form-component-radiomark"></span>
        </label>
      </td>
      <td>{form.submittedBy.email}</td>
      <td className="client-index">
        {formatDate(form.submittedAt)}
      </td>
      <td className="client-index">
        {form && form.versions && form.currentVersion && (
          <div className="results-page-heading-versions-container">
            <div 
              onClick={() => setIsVersionDropDownUnic(prev => !prev)} 
              className='results-page-heading-versions-current'
            >
              <div>
                version {!currentVersionUnic ? form.currentVersion : currentVersionUnic}
              </div>
              {form.versions?.length !== 0 && (
                <div 
                  className='icon-flex-container'
                  style={{
                    transform: isVersionsDropdownUnic ? 'rotate(180deg)' : ''
                  }}
                >
                  <img className='size22-icon' src={dropdown_icon} alt="⯆" />
                </div>
              )}
            </div>
            {isVersionsDropdownUnic && (
              <div className="results-page-heading-versions-list">
                {form.versions.map((version, versionIndex) => (
                  <div 
                    key={versionIndex} 
                    className="results-page-heading-versions-list-item"
                    onClick={() => handleChange(version.versionNumber)}
                  >
                    version {version.versionNumber}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

const FormGroupSubsChoser = ({chosenFormSubs, updateFormGroup}) => {
  const [chosenSubmission, setChosenSubmisson] = useState('');
  const [chosenVersion, setChosenVersion] = useState();

  const handleChoseSubmission = (submission) => {
    setChosenSubmisson(submission._id);
    setChosenVersion(submission.currentVersion || '1');
  };

  const handleVersionChange = (versionNumber) => {
    console.log('handleVersionChange :', versionNumber)
    setChosenVersion(versionNumber);
  };

  return (
    <div className="form-group-cover-page-edit">
      <div className="header-section">
        <h1 className="header-title">Submission choser: </h1>
        <div className="button-group">
          {chosenSubmission && (
            <button 
              className='modal-button' 
              type="submit" 
              onClick={() => updateFormGroup({chosenSubmission: chosenSubmission, chosenVersion: chosenVersion})}
            >
              Submit choice 
            </button>
          )}
        </div>
      </div>
      <div className="dashboard-page-content"> 
        <table className="clients-table">
          <thead>
            <tr>
              <th></th>
              <th>Submitted by</th>
              <th>Submitted time</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {chosenFormSubs.map((form, formIndex) => (
              <FormSubmissionRow
                key={form._id}
                form={form}
                isSelected={form._id === chosenSubmission}
                onSelectSubmission={handleChoseSubmission}
                onVersionChange={handleVersionChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormGroupSubsChoser;