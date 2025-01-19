import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../FormLiveStyles.css';
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg';
import pdf_icon from '../icons/file-pdf-icon.svg';
import dropdown_icon from '../icons/dropdown-icon.svg';
import cancel_icon from '../icons/cancel-red-icon.svg';
import save_icon from '../icons/save-icon.svg';
import { backend_point } from '../consts';
import { addingNewComponent, getAuthToken, getUserEmail, getUserId, initializeFieldData } from '../utils';
import FormResultEditingComponent from './FormResultEditingComponent';

const FormResultsEditing = ({form, currentVersion, 
  toMainBoardHandler, handleCancelEditing,
  updateForm, setIsLoading,
  saveWarning, handleSaveWarning, handleVersionChange, 
  isVersionsDropdown, setIsVersionDropDown }) => {

  const [formFields, setFormFields] = useState();

  const userId = getUserId();
  const userEmail = getUserEmail();
  const formRef = useRef(null);

  const handleSaveChanges = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  
  const [displayVersion, setDisplayVersion] = useState()
  
  useEffect(() => {
    if(form.versions && form.versions[currentVersion-1]){
      setDisplayVersion(form.versions[currentVersion-1])
      console.log('setted : ', form.versions[currentVersion-1])
    }else{
      setDisplayVersion(form)
    }
    console.log(' FormResultView displayVersion : ', displayVersion)

  },[form, currentVersion])


  useEffect(() => {
    if(form.versions && form.versions[currentVersion]){
      setFormFields(form.versions[currentVersion].fields)
    }else{
      setFormFields(form.fields)
    }
    console.log(' FormResultsEditing formFields : ', formFields)
  }, [form, currentVersion]);


  const [file, setFile] = useState(null);

  // Handle file selection from child component
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };
  // fileData.append('folderName', formTitle);
  // console.log('fileData : ', fileData)

  const uploadFile = async (file, folderName) => {
    if (!file) return null;
  
    const fileData = new FormData();
    fileData.append('document', file);
    fileData.append('folderName', folderName);
    const token = getAuthToken();
  
    try {
      const response = await axios.post(`${backend_point}/api/awsFiles/upload`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`,
        },
      });
      return response.data.fileData;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  
  const handleAddingComponent = (componentData, addingIndex) => {
    const newField = addingNewComponent(componentData.adding_component);
    console.log('handleAddingComponent : ', addingIndex, newField)
    console.log('formFields.slice(0, addingIndex) : ', formFields.slice(0, addingIndex))
    console.log('formFields.slice(addingIndex) : ', formFields.slice(addingIndex))
    setFormFields([...formFields.slice(0, addingIndex), newField, ...formFields.slice(addingIndex)])
  };

  const updateFormVersion = async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true);

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    let fileData = null;
    if (file) {
      fileData = await uploadFile(file, form.title);
      if (!fileData) {
        //setIsLoading(false);
        return;
      }
    }
    const formData = {};

    const formElements = event.target.elements;
    console.log('form elements  : ',formElements);
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      const customType = element.getAttribute('customtype'); 
      const sectionName = element.getAttribute('sectionName'); 
      const fieldType = element.getAttribute('fieldtype'); 
      const columnType = element.getAttribute('columntype');
      const columnIndex = element.getAttribute('columnindex'); 
      const correctiveActionText = element.getAttribute('correctiveactiontext'); 
      const correctiveActionId = element.getAttribute('correctiveactionid'); 

      //console.log(' saving results  : ', fieldType, element)
      for(let j = 0; j < formFields.length; j++){
        if(formFields[j].type === 'section'){
          for (let k = 0; k < formFields[j].components.length; k++) {
            const elementBack = formFields[j].components[k];
            console.log(element.id, elementBack.id)
            if (element.id == elementBack.id) {
              initializeFieldData({element, columnIndex, elementBack,
                formData,
                fieldType,
                customType,
                sectionName,
                columnType,
                correctiveActionText,
                correctiveActionId,
              });
            }
          }
        }
        const elementBack = formFields[j];
        if (element.id == elementBack.id ) {
          initializeFieldData({element, columnIndex, elementBack,
            formData,
            fieldType,
            customType,
            sectionName,
            columnType,
            correctiveActionText,
            correctiveActionId,
          });
        }
      }
    }
    
    try {
      const formUpdateData = {
        fields: form.fields,
        formData: formData,
        userData: {
          id: userId,
          email: userEmail
        },
        changeReason: "Updated form values"
      };
  
      const response = await axios.put(`${backend_point}/api/subm_forms/${form._id}/version`, 
        formUpdateData, config);
  
      console.log('Form version updated successfully:', response.data);
      updateForm();
      setFile(null)
      //setIsUpdated(true);
      
    } catch (error) {
      if (error.response) {
        console.error('Error updating form version:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
    {
      displayVersion && 
      <>
        <div className="results-page-heading">
          <div className="results-page-heading-title">
            <div className="dashboard-page-title">
            <div className="go-back-button" onClick={toMainBoardHandler} >
              <img src={arrow_menu_icon} alt="Go Back" />
            </div>
              {form.title} results
            </div>
            <div className="results-sub-title">
              {`submitted by ${form.submittedBy.email}`}
              {/* {`submitted by ${form.submittedBy.email} at ${formatDate(displayVersion?.timestamp)}`} */}
            </div>
          </div>
          <div className='results-page-heading-title-options'>
            <button type='button' 
              id='submit_changes'
              className='results-page-heading-action-button'
              help-title="submit changes"
              onClick={handleSaveChanges}>
              <img className="size22-icon" src={save_icon}/>
              {
                saveWarning && 
                <div className="results-page-heading-warning">
                  Save a version before export!
                </div>
              }
            </button>
            <button type='button' 
              id='cancel_editing'
              className='results-page-heading-action-button'
              help-title="cancel editing"
              onClick={handleCancelEditing}>
              <img className="size24-icon" src={cancel_icon}/>
            </button>
            {
            form && form.versions && form.currentVersion &&
            <div className="results-page-heading-versions-container">
              <div onClick={() => setIsVersionDropDown(prev=> !prev)} className='results-page-heading-versions-current'>
                <div>version {!currentVersion ? form.currentVersion : currentVersion}</div>
                {
                  form.versions?.length !== 0 &&
                  <div className='icon-flex-container'
                  style={{transform: isVersionsDropdown ? 'rotate(180deg)' : ''}}>
                    <img className='size22-icon' src={dropdown_icon} alt="⯆" />
                  </div>
                }
              </div>
              {
                isVersionsDropdown &&
                <div className="results-page-heading-versions-list">
                  {form.versions.map((version, versionIndex) => (
                    <div key={versionIndex} className="results-page-heading-versions-list-item"
                    onClick={() => handleVersionChange(version.versionNumber)}>
                      version {version.versionNumber}
                    </div>
                  ))}
                </div>
              }
            </div>
            }
            <div onClick={() => handleSaveWarning()} className='results-page-heading-action-button'>
              <img className="size24-icon" src={pdf_icon}/>
              Export to PDF
            </div>
          </div>
        </div>
        <div className="form-result-container">
          {
            formFields ?
              <form ref={formRef} className="form-result-content" 
              onSubmit={updateFormVersion}>
                {formFields.map((field, index) => {
                  return field.type === 'section' ?(
                    <div key={field.id || index} className="section-container">
                      {field.components.map((sectionField, sectionIndex) => (
                        <FormResultEditingComponent
                          key={sectionField.id || `${index}-${sectionIndex}`}
                          field={sectionField} 
                          data={displayVersion.data}
                          index={sectionIndex}
                          parentIndex={index}
                          onFileChange={handleFileChange}
                          handleAddingComponent={handleAddingComponent}
                          isSectionComponent={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <FormResultEditingComponent
                      key={field.id || index}
                      field={field}
                      data={displayVersion.data}
                      index={index}
                      onFileChange={handleFileChange}
                      handleAddingComponent={handleAddingComponent}
                    />
                  );
                  }
                )}
              </form>
            :
            <></>
          }
        </div>
      </>
    }
 
    </>
  );
};

export default FormResultsEditing;