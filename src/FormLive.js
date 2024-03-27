import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import FormLiveComponent from './FormLiveComponent';
import './FormLiveStyles.css';

const FormLive = () => {
  const [formTitle, setFormTitle] = useState('New Form');
  const [formFields, setFormFields] = useState();
  const { formId } = useParams();


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
        console.log('formFields update goes brrrrr>.',prevFormFields, formFields )
      }

  }, [formFields]);

  useEffect(() => {

    const getForm = async () => {
      try {
        if (formId === 'new') {
          const response = await axios.post('http://localhost:8000/api/forms/new');
          const formData = response.data;
          setFormTitle(formData.title);
          setFormFields(formData.fields);
        } else {
          const response = await axios.get(`http://localhost:8000/api/forms/${formId}`);
          const formData = response.data;
          setFormTitle(formData.title);
          setFormFields(formData.fields);
        }
      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };

    getForm();
  }, []);

  const saveForm = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/forms', {
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



  return (
    <div className="form-live-page">
      {
        formFields ?
        <form className="form-live-content">
          {formFields.map((field, index) => (
            <FormLiveComponent field={field} index={index}/>
            )
          )}
          <div className='form-live-footer'>
            <div className='form-live-submit-button-container'>
              <button className='form-live-submit-button'>
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