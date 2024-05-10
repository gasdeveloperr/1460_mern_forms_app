import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import FormLiveComponent from './FormLiveComponent';
import './FormLiveStyles.css';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { getAuthToken } from './utils';

const FormLive = () => {

  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState('New Form');
  const [formFields, setFormFields] = useState();
  const { formId } = useParams();

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
        setFormFields(formData.fields);

      } catch (err) {
        if(err.response.status === 401){
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

  const submitHandler = async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true);

    const formData = {};

    console.log('formFields : ', formFields)

    // Loop through all the form elements and collect their values
    const formElements = event.target.elements;
    console.log('form elements  : ',formElements);
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      const customType = element.getAttribute('customtype'); 
      const fieldType = element.getAttribute('fieldtype'); 
      for(let j = 0; j < formFields.length; j++){
        const elementBack = formFields[j];
        if (element.id == elementBack.id ) {
          if (!formData[element.id]) {
            switch(fieldType){
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

          console.log('elem custom type: ', customType)
          console.log('elem  type: ', element.type)
          switch(fieldType){
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
      setIsSubmited(true)
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
    

    // TODO: Perform further actions with the form data (e.g., send to server, update state, etc.)
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
          <p>You can go back to the dashboard to submit other forms.</p>
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