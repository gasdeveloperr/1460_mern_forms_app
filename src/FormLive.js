import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import FormLiveComponent from './FormLiveComponent';
import './FormLiveStyles.css';
import Spinner from './Spinner';

const FormLive = () => {
  const [formTitle, setFormTitle] = useState('New Form');
  const [formFields, setFormFields] = useState();
  const { formId } = useParams();

  const  [isLoading, setIsLoading] = useState(false)
  const  [isError, setIsError] = useState('')

  const backend_point = 'https://one460-forms-backend.onrender.com'
  //'http://localhost:8000'
  //'https://one460-forms-backend.onrender.com'


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

    const getForm = async () => {
      try {
        const response = await axios.get(`${backend_point}/api/forms/${formId}`);
        const formData = response.data;
        setIsLoading(false);
        setFormTitle(formData.title);
        setFormFields(formData.fields);

      } catch (err) {
        setIsError('Error fetching form, please refresh the page')
        console.error('Error fetching form:', err);
      }
    };

    setIsLoading(true);
    getForm();
  }, []);

  const saveForm = async () => {
    try {
      const response = await axios.post(`${backend_point}/api/subm_forms/${formId}`, {
        title: formTitle,
        fields: formFields,
      });
      console.log('Form saved successfully:', response.data);
      // Handle success, show a success message, redirect, etc.
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error saving form:', error.response.data);
        // Handle specific error cases based on the response status code
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from the server');
      } else {
        // Something happened in setting up the request
        console.error('Error:', error.message);
      }
    }
  };

  const updateForm = async (formId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/forms/${formId}`, {
        title: formTitle,
        fields: formFields
      });
      console.log('Form updated successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error saving form:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const submitButtonComponent = {
    id: 'submit_button',
    type: 'submit_button',
    title: 'Submit form',
    value: 'Submit form',
    options: [],
    required: false,
  };

  const submitHandler = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create an object to store the form data
    const formData = {};

    // Loop through all the form elements and collect their values
    const formElements = event.target.elements;
    console.log('from the submit : ',formElements);
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.id) {
        formData[element.id] = {name: '', value:''}
        if (element.type === 'checkbox' || element.type === 'radio') {
          if (element.checked) {
            formData[element.id].name = element.name
            formData[element.id].value = element.value;
          }
        } else {
          formData[element.id].name = element.name
          formData[element.id].value = element.value;
        }
      }
    }

    // Log the form data for demonstration purposes
    console.log('from the submit : ',formData);

    // TODO: Perform further actions with the form data (e.g., send to server, update state, etc.)
  };



  return (
    <div className="form-live-page">
      {
        isLoading ?
          <Spinner/>
        :  
        isError ?
          <div className='error-message' >
            {isError}
          </div>
        :
        formFields ?
        <form className="form-live-content" onSubmit={submitHandler}>
          {formFields.map((field, index) => (
            <FormLiveComponent field={field} index={index}/>
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
        :
        <></>
      }
    </div>
  );
};

export default FormLive;