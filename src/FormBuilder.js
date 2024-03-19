import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Header from './Header';
import FormBuilderSideBar from './FormBuilderSideBar';
import FormBuilderField from './FormBuilderField';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState('New Form');
  const [formFields, setFormFields] = useState([]);
  const { formId } = useParams();

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
        // Add other form data properties
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
      const response = await axios.put(`http://localhost:8000/forms/${formId}`, {
        title: formTitle,
        fields: formFields
      });
      console.log('Form updated successfully:', response.data);
    } catch (err) {
      console.error('Error updating form:', err);
    }
  };

  const [editorMode, setEditorMode] = useState('')

  useEffect(() => {

  }, [editorMode])

  const submitButtonComponent = {
    id: 'submit_button',
    type: 'submit_button',
    title: 'Submit form',
    value: 'Submit form',
    options: [],
    required: false,
  };
  const accept_types_array = ['short_answer', 'long_answer', 'name', 'address', 'email', 'phone',
  'number', 'dropdown', 'radio', 'checkbox', 'credit_card', 'date_time', 'file_upload', 
  'matrix', 'description', 'embed_code', 'event_product', 'signature', 'rating', 
  'section']

  const [isDragging, setIsDragging] = useState(false);
  const [dropAreaPositions, setDropAreaPositions] = useState([]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropAreaPositions([]);
  };

  const handleDrop = (item, index) => {
    const newField = {
      id: Date.now(),
      type: item.type,
      title: item.title,
      value: '',
      options: [],
      required: false,
    };
    if(item.type = 'name'){
      newField.labels = ['First name', 'Last name']
    }
    setFormFields([...formFields.slice(0, index), newField, ...formFields.slice(index)]);
  };

  const addFormField = (field) => {
    const newField = {
      id: Date.now(),
      type: field.type,
      title: field.title,
      value: '',
      options: [],
      required: false,
    };
    if(field.type = 'name'){
      newField.labels = ['First name', 'Last name']
    }
    setFormFields([...formFields, newField]);
  };

  const updateFormField = (id, updatedField) => {
    const updatedFormFields = formFields.map((field) =>
      field.id === id ? updatedField : field
    );
    setFormFields(updatedFormFields);
  };

  const removeFormField = (id) => {
    let updatedFormFields = formFields.filter((field) => field.id !== id);
    if(updatedFormFields.length === 1){
      updatedFormFields = updatedFormFields.filter((field) => field.id !== 'submit_button');
    }
    setFormFields(updatedFormFields);
  };
  const [, drop] = useDrop({
    accept: accept_types_array,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const renderFormField = (field, index) => {
    return (
      <FormBuilderField key={index} field={field} index={index} isDragging={isDragging}
      handleDrop={handleDrop} removeFormField={removeFormField} setEditor={setEditorMode}/>
    );
  };

  return (
    <div className='page-content'>
      <Header />
      <div className='page-body'>
        <div className='form-builder-page-header'>
          <h2>{formTitle}</h2>
          <div className='form-builder-page-header-button' onClick={saveForm}>Save Form</div>
        </div>
        <div className="form-builder-page-content">
          <FormBuilderSideBar setIsDragging={setIsDragging} setDropAreaPositions ={setDropAreaPositions} editorMode={editorMode}/>
          <div className='form-builder-part'>
            <div className='form-constructor' ref={drop}>
              
              {formFields.length === 0 ? 
                <div className='form-constructor-empty-state'>
                  <div className="empty-state-icon">
                    <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3e %3cdefs%3e %3clinearGradient id='a' x1='18.131%25' x2='81.988%25' y1='7.998%25' y2='87.591%25'%3e %3cstop offset='0%25' stop-color='%23E6F6F8'/%3e %3cstop offset='100%25' stop-color='%23CEECF0'/%3e %3c/linearGradient%3e %3clinearGradient id='b' x1='119.905%25' x2='65.11%25' y1='28.754%25' y2='-22.1%25'%3e %3cstop offset='0%25' stop-color='%23069EB4'/%3e %3cstop offset='100%25' stop-color='%2361CAE2'/%3e %3c/linearGradient%3e %3c/defs%3e %3cg fill='none' fill-rule='evenodd'%3e %3ccircle cx='50' cy='50' r='50' fill='url(%23a)'/%3e %3cg stroke='url(%23b)' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' transform='translate(24 24)'%3e %3cpath d='M36.217 20.317H47.7a4.416 4.416 0 0 1 4.417 4.416V47.7a4.416 4.416 0 0 1-4.417 4.417H24.733a4.416 4.416 0 0 1-4.416-4.417v-9.717M16.342 30.917h-.884'/%3e %3cpath stroke-dasharray='1,3.980000019073486' d='M11.962 30.917H5.299A4.417 4.417 0 0 1 .883 26.5V5.3A4.417 4.417 0 0 1 5.299.883h21.2A4.416 4.416 0 0 1 30.916 5.3v7.084'/%3e %3cpath d='M16.647 28.833v3.126c0 2.177 2.217 4.688 4.581 4.688h4.389c5.85 0 10.6-4.542 10.6-9.927 0-2.588-1.116-5.068-3.104-6.897l-3.317-3.055c-.887-.816-2.324-.816-3.21 0-.886.816-.886 2.14 0 2.955l-1.07-.984c-.888-.816-2.324-.816-3.211 0-.886.815-.886 2.14 0 2.955l1.071.984-1.606-1.476c-.886-.816-2.324-.816-3.21 0-.887.815-.887 2.14 0 2.955l2.675 2.463-2.344-2.157c-.885-.816-2.323-.816-3.209 0-.887.816-.887 2.14 0 2.956L20.68 32'/%3e %3c/g%3e %3c/g%3e %3c/svg%3e"/>
                  </div>
                  <h1 className="empty-state-title">
                    Welcome to your blank form!
                  </h1>
                  <div className="empty-state-subtitle">
                    Drag and drop fields from the left sidebar to this area.
                  </div>
                </div>
                :  formFields.map(renderFormField)
              }
              <div className="form-submit-button-container">
               { formFields.length !== 0 ? 
                  (
                  <button className='form-submit-button'>
                    {submitButtonComponent.value}
                  </button>
                  )
                  : <></>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;