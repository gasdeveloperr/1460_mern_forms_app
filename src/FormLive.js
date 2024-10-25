import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import FormLiveComponent from './FormLiveComponent';
import './FormLiveStyles.css';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { getAuthToken, getUserEmail, getUserId } from './utils';

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

  const submitButtonComponent = {
    id: 'submit_button',
    type: 'submit_button',
    title: 'Submit form',
    value: 'Submit form',
    options: [],
    required: false,
  };

  const [file, setFile] = useState(null);

  // Handle file selection from child component
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const uploadFile = async (file) => {
    if (!file) return null;
  
    const fileData = new FormData();
    fileData.append('document', file);

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
  
    try {
      const response = await axios.post(`${backend_point}/upload`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // File uploaded successfully, return file data
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
      // Step 1: Upload the file
      fileData = await uploadFile(file);
      if (!fileData) {
        setIsLoading(false);
        return; // Stop if the file upload failed
      }
    }
    const formData = {};

    console.log('formFields : ', formFields)

    // Loop through all the form elements and collect their values
    const formElements = event.target.elements;
    console.log('form elements  : ',formElements);
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      const customType = element.getAttribute('customtype'); 
      const sectionName = element.getAttribute('sectionName'); 
      const fieldType = element.getAttribute('fieldtype'); 
      const columnType = element.getAttribute('columntype'); 
      for(let j = 0; j < formFields.length; j++){
        const elementBack = formFields[j];
        if (element.id == elementBack.id ) {
          if (!formData[element.id]) {
            switch(fieldType){
              case 'double_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'triple_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'two_inputs_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'triple_inputs_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'four_inputs_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'five_inputs_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'multi_section' :
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'checkbox':
                formData[element.id] = {name: elementBack.title, value:[]}
                break;
              case 'name': 
                formData[element.id] = {name: elementBack.title, value:{}}
                break;
              case 'date_time':  
                formData[element.id] = {name: elementBack.title, value:{}}
                break;
              default:
                formData[element.id] = {name: elementBack.title, value:''};
                break;
            }
          }
          //setting element type for subm data field
          formData[element.id].type = fieldType;

          console.log('formData[element.id] :', formData[element.id])

          console.log(' switch(fieldType) : ', fieldType)

          switch(fieldType){
            case 'double_section' :
              formData[element.id].value.push({label: sectionName, value: element.value});
              break;
            case 'triple_section' :
              formData[element.id].value.push({label: sectionName, value: element.value});
              break;
            case 'two_inputs_section' :
              formData[element.id].value.push(element.value);
              break;
            case 'triple_inputs_section' :
              formData[element.id].value.push(element.value);
              break;
            case 'four_inputs_section' :
              formData[element.id].value.push(element.value);
              break;
            case 'five_inputs_section' :
              formData[element.id].value.push(element.value);
              break;
            case 'multi_section' :
              formData[element.id].value.push(element.value);
              break;
            case 'checkbox':
              if (element.checked) {
                formData[element.id].value.push(element.name);
              };
              break;
            case 'radio': 
              if (element.checked) {
                formData[element.id].value = element.value;
              }
              break;
            case 'name': 
              if (customType === 'first_name') {
                formData[element.id].value.first_name = element.value;
              }
              if (customType === 'last_name') {
                formData[element.id].value.last_name = element.value;
              }
              break;
            case 'date_time':  
              if (customType === 'date') {
                formData[element.id].value.date = element.value;
              }
              if (customType === 'time') {
                formData[element.id].value.time = element.value;
              }
              break;
            default:
              formData[element.id].value = element.value;
              break;
          }
        }
      }
    }

    const submittedTime = Date.now();
    const formSubmsn = {
      formData: formData,
      fileData: fileData,
      formTitle: formTitle,
      formType: formType,
      fields: formFields,
      userData: {id: userId, email: userEmail},
      submittedAt: submittedTime
    }
    console.log('data from the submit : ',formSubmsn);

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.post(`${backend_point}/api/subm_forms/${formId}`, formSubmsn, config);
      console.log('Form updated successfully:', response.data);
      setIsLoading(false);
      setIsSubmited(true);
      setFile(null)
      //if(response.)
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
            {formFields.map((field, index) => (
              <FormLiveComponent field={field} index={index} onFileChange={handleFileChange}/>
              )
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