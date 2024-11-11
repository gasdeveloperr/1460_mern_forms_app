import React, { useState } from 'react';
import '../clients_page_components/ClientAddingWindow.css';
import Spinner from '../Spinner';
import './FormGroupChoosingWindow.css';


const FormGroupChoosingWindow = ({isOpen, formGroups, chosenFormToAddIntoGroup, addFormIntoGroupHandler, onClose}) => {
  const [isFormGroupsLoading, setIsFormGroupsLoading] = useState(false);

  const [isError, setIsError] = useState('')

  if (!isOpen) return null;
  if (isFormGroupsLoading) return (
    <div className="window-overlay">
      <div className="window-content">
        <Spinner />
      </div>
    </div>
  )

  return (
    <div className="window-overlay" id='choosing-formGroups-window'>
      <div className="window-content">
        <h2>Choose a form group: </h2>
        <div className='formGroups-chooser-body'>
          {formGroups && formGroups.length !== 0 ?
            formGroups.map((formGroup, formGroupIndex) => (
              <div key={formGroupIndex} className='option-chooser-container'>
                <div className="option-chooser-title">
                  {formGroup.title}
                </div>
                <hr className='option-hr'/>
                <div className="form-actions">
                  <button className='modal-button' type="submit" onClick={() => addFormIntoGroupHandler(formGroup._id)}>
                    Add form
                  </button>
                </div>
              </div>
            ))
          : <></>
          }
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => onClose()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
 
export default FormGroupChoosingWindow;