import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import FormLiveComponent from './FormLiveComponent';
import './FormLiveStyles.css';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { addingNewComponent, getAuthToken, getUserEmail, getUserId, initializeFieldData } from './utils';

const FormLive = () => {

  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('New Form');
  const [formType, setFormType] = useState('blank');
  const [formFields, setFormFields] = useState();
  const { formId } = useParams();

  const userId = getUserId();
  const userEmail = getUserEmail();

  const  [isLoading, setIsLoading] = useState(false)
  const  [isError, setIsError] = useState('')

  const [isSubmited, setIsSubmited] = useState(false)

  const usePrevious = (value) => {
    const ref = useRef();
  
    useEffect(() => {
      ref.current = value;
    }, [value]);
  
    return ref.current;
  };

  const prevFormFields = usePrevious(formFields);

  useEffect(() => {
      if (prevFormFields && !isEqual(prevFormFields, formFields)) {
        //console.log('formFields update goes brrrrr>.',prevFormFields, formFields )
      }

  }, [formFields]);

  useEffect(() => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    const getForm = async () => {
      try {
        const response = await axios.get(`${backend_point}/api/forms/${formId}`, config);
        const formData = response.data;
        setIsLoading(false);
        setFormTitle(formData.title);
        setFormType(formData.formType);
        setFormFields(formData.fields);

      } catch (err) {
        if(err.response && err.response.status === 401){
          localStorage.removeItem('token');
          navigate('/login');
        }else{
          setIsError('Error fetching form, please refresh the page')
          console.error('Error fetching forms:', err);
        }
      }
    };

    setIsLoading(true);
    getForm();
  }, []);

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
  

  const submitHandler = async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true);
    
    let fileData = null;
    if (file) {
      fileData = await uploadFile(file, formTitle);
      if (!fileData) {
        setIsLoading(false);
        return;
      }
    }
    const formData = {};

    const formElements = event.target.elements;
    //console.log('form elements  : ',formElements);
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      const customType = element.getAttribute('customtype'); 
      const sectionName = element.getAttribute('sectionName'); 
      const fieldType = element.getAttribute('fieldtype'); 
      const columnType = element.getAttribute('columntype');
      const columnIndex = element.getAttribute('columnindex');
      const rowIndex = element.getAttribute('rowindex'); 
      const correctiveActionText = element.getAttribute('correctiveactiontext'); 
      const correctiveActionId = element.getAttribute('correctiveactionid'); 

      // console.log(' saving results  : ', fieldType, element, columnIndex, rowIndex)
      for(let j = 0; j < formFields.length; j++){
        if(formFields[j].type === 'section'){
          for (let k = 0; k < formFields[j].components.length; k++) {
            const elementBack = formFields[j].components[k];
            //console.log(element.id, elementBack.id)
            if (element.id == elementBack.id) {
              initializeFieldData({element, columnIndex, rowIndex, elementBack,
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
          initializeFieldData({element, columnIndex, rowIndex, elementBack,
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
    const submittedTime = Date.now();
    const formSubmsn = {
      formTitle: formTitle,
      userData: {id: userId, email: userEmail},
      fileData: fileData,
      formData: formData,
      formType: formType,
      fields: formFields,
      submittedAt: submittedTime
    }
    //console.log('data from the submit : ',formSubmsn);

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.post(`${backend_point}/api/subm_forms/${formId}`, formSubmsn, config);
      //console.log('Form updated successfully:', response.data);
      setIsLoading(false);
      setIsSubmited(true);
      setFile(null)
    } catch (error) {
      if (error.response) {
        console.error('Error saving form:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
      setIsLoading(false);
    }
  };

  
  const handleAddingComponent = (fieldId, updatedField) => {
    // console.log(fieldId, updatedField)
    // console.log('formFields : ', formFields)
    const updatedFields = formFields.map(field => {
      if (field.id === fieldId && field.type === 'columns') {
        return { ...field, value: updatedField};
      }else{
         if (field.components) {
          const updatedComponents = field.components.map(componentObj => {
            if (componentObj.id === fieldId && componentObj.type === 'columns') {
              return { ...componentObj, value: updatedField};
            }
            return field;
          });
          return { ...field, components: updatedComponents };
        }
        return field;
      }
    });
    setFormFields(updatedFields)
  };

  return (
    <div className="form-live-page">
      <Header/>
      {
        isLoading ?
          <Spinner/>
        :  
        isError ?
          <div className='error-message' >
            {isError}
          </div>
        :
        isSubmited ?
        <div className="form-live-submitted-block">
          <p>Form successfully submitted!</p>
          <p>You can go back to the <a href="/forms/dashboard">Assessments</a> to submit other forms.</p>
          <p>You can <a href={`/forms/live/${formId}`}>fill this form again</a>.</p>
        </div>
        :
        formFields ?
        <div className="form-live-container">
          <form className="form-live-content" onSubmit={submitHandler}>
            <div className="form-live-title">
              {formTitle}
            </div>
            {formFields.map((field, index) => {
              return field.type === 'section' ?(
                <div key={field.id || index} className="section-container">
                  {field.components.map((sectionField, sectionIndex) => (
                    <FormLiveComponent
                      key={sectionField.id || `${index}-${sectionIndex}`}
                      field={sectionField}
                      index={sectionIndex}
                      parentIndex={index}
                      onFileChange={handleFileChange}
                      handleAddingComponent={handleAddingComponent}
                      isSectionComponent={true}
                    />
                  ))}
                </div>
              ) : (
                <FormLiveComponent
                  key={field.id || index}
                  field={field}
                  index={index}
                  onFileChange={handleFileChange}
                  handleAddingComponent={handleAddingComponent}
                />
              );
              }
            )}
            <div className='form-live-footer'>
              <div className='form-live-submit-button-container'>
                <button type="submit" className='form-live-submit-button'>
                  Submit form
                </button>
              </div>
            </div>
          </form>
        </div>
        :
        <></>
      }
    </div>
  );
};

export default FormLive;