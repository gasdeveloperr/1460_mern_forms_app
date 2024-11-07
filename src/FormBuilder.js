import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Header from './Header';
import FormBuilderSideBar from './FormBuilderSideBar';
import FormBuilderField from './FormBuilderField';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { accept_types_array, backend_point } from './consts';
import isEqual from 'lodash/isEqual';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { addingNewComponent, getAuthToken } from './utils';
import OptionsSavingWindow from './OptionsSavingWindow';
import OptionsChoosingWindow from './OptionsChoosingWindow';

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('scored');
  const [formFields, setFormFields] = useState();
  const { formId } = useParams();

  const navigate = useNavigate();

  const  [isLoading, setIsLoading] = useState(false)
  const  [isError, setIsError] = useState('')


  const usePrevious = (value) => {
    const ref = useRef();
  
    useEffect(() => {
      ref.current = value;
    }, [value]);
  
    return ref.current;
  };

  const prevFormFields = usePrevious(formFields);

  // useEffect(() => {
  //   if (prevFormFields && !isEqual(prevFormFields, formFields)) {
  //     updateForm(formId)
  //     console.log('formFields update goes brrrrr>.',prevFormFields, formFields, formType )
  //   }
  // }, [formFields]);
  useEffect(() => {
    const prevFormFieldsStr = JSON.stringify(prevFormFields);
    const currentFormFieldsStr = JSON.stringify(formFields);
  
    if (prevFormFields && prevFormFieldsStr !== currentFormFieldsStr) {
      updateForm(formId);
      console.log('Form fields updated:', prevFormFields, formFields, formType);
    }
  }, [formFields]);
  

  const [editingField, setEditingField] = useState({id:''})
  const [editingSectionField, setEditingSectionField] = useState({id:''})

 
  const fetchForm = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

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
        setIsError('Error fetching form, please refresh the page');
        console.error('Error fetching form:', err);
      }
    }
  };

  useEffect(() => {
    const timeLog = new Date()
    console.log('load new form page : ', timeLog)
    setIsLoading(true);
    fetchForm();
  }, []);

  const updateForm = async (formId) => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    try {
      await axios.put(`${backend_point}/api/forms/${formId}`, {
        title: formTitle,
        formType: formType,
        fields: formFields
      }, config);
      //console.log('Form updated successfully:', response.data);
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

  const [isDragging, setIsDragging] = useState(false);
  const [dropAreaPositions, setDropAreaPositions] = useState([]);

  const handleDrop = (item, dropIndex, sectionId) => {
    if(item.index === 'bar_component'){
      const newField = addingNewComponent(item);
      if(sectionId){
        // Find the section and add the new component to its 'components' array
        const updatedFormFields = formFields.map((field) => {
          if (field.id === sectionId && field.type === 'section') {
            console.log('finded section : ', field)
            return {
              ...field,
              components: [...field.components, newField],
            };
          }
          return field;
        });
        setFormFields(updatedFormFields);
        console.log('new field into section:', newField);

      }else{
        setFormFields([...formFields.slice(0, dropIndex), newField, ...formFields.slice(dropIndex)]);
        console.log('new field :', newField)
      }
    }else{
      if(sectionId){
        const updatedFormFields = formFields.map((field) => {
          if (field.id === sectionId && field.type === 'section') {
            console.log('found section:', field);
      
            // Find the current index of the component to be moved
            const itemIndex = field.components.findIndex(component => component.id === item.id);
      
            // Remove the component from its current position and insert it into the new position
            const newComponentsArray = [
              ...field.components.slice(0, itemIndex),
              ...field.components.slice(itemIndex + 1)
            ];
            const newField = { ...item}; // Assign a new ID if needed
            setEditingField({ ...field, components: [
                ...newComponentsArray.slice(0, dropIndex),
                newField,
                ...newComponentsArray.slice(dropIndex)
              ]})
            return {
              ...field,
              components: [
                ...newComponentsArray.slice(0, dropIndex),
                newField,
                ...newComponentsArray.slice(dropIndex)
              ],
            };
          }
          return field;
        });
        
        setFormFields(updatedFormFields);
        console.log('moved component within section:', updatedFormFields);

      }else{
        const itemIndex = formFields.findIndex(field => field.id === item.id)
        const newField = {...item, id: Date.now()}
        const dragField = formFields[itemIndex];
        const newArray = [...formFields.slice(0, itemIndex), ...formFields.slice(itemIndex+1)]
        setFormFields([...newArray.slice(0, dropIndex), newField, ...newArray.slice(dropIndex)])
      }
    }
  };
    
  const [options, setOptions] = useState('');
  const [chosenOptions, setChosenOptions] = useState('');
  const [isOptionsSavingWindow, setIsOptionsSavingWindow] = useState(false);
  const [isOptionsChoosingWindow, setIsOptionsChoosingWindow] = useState(false);

  const handleOptionsSaving = (optionsData) => {
    setOptions(optionsData);
    setIsOptionsSavingWindow(true);

  }
  const closeOptionsSavingWindow = () => {
    setIsOptionsSavingWindow(false);
  }
  const closeOptionsChoosingWindow = () => {
    setIsOptionsChoosingWindow(false);

  }

  const updateFormTitleHandler = (e) => {
    setFormTitle(e.target.value)
  }
  const updateFormTypeHandler = (value) => {
    setFormType(value)
  }

  const updateFormField = (id, updatedField) => {
    //console.log('update field params : ', id, updatedField)
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
  const removeFormSectionField = (id, sectionId) => {
    const updatedFormFields = formFields.map((field) => {
      if (field.id === sectionId) {
        return {
          ...field,
          components: field.components.filter((component) => component.id !== id),
        };
      }
      return field;
    });
  
    // Update formFields with the modified array
    setFormFields(updatedFormFields);
  };

  const handleDuplicateClick = (id) => {
    const fieldToDuplicate = formFields.find((field) => field.id === id);
  
    if (fieldToDuplicate) {
      const duplicatedField = { ...fieldToDuplicate };
      
      // Generate a new unique ID (e.g., using current timestamp)
      duplicatedField.id = new Date().getTime();
  
      setFormFields([...formFields, duplicatedField]);
    }
  }
  const [, drop] = useDrop({
    accept: accept_types_array,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className='page-content'>
      <Header />
      <div className='editor-page-body'>
        <div className='form-builder-page-header'>
          <input className='form-title-input' onChange={updateFormTitleHandler} value={formTitle}/>
          <Link 
            className='form-builder-page-header-button'
            to={`/forms/live/${formId}`}
            target="_blank"
            rel="noopener noreferrer">
            Live form
          </Link>
          {/* <div className='form-builder-page-header-button' onClick={() => updateForm(formId)}>Save Form</div> */}
        </div>
        {/* <div className="panel">
          <div className="panel-item">
            <span className="icon"></span>
            <span className="text">Forms</span>
          </div>
          <div className="panel-item uncategorized">
            <span className="icon"></span>
            <span className="text">Uncategorized</span>
          </div>
          <div className="panel-item">
            <span className="text">test_form</span>
            <span className="icon"></span>
          </div>
        </div> */}
        <OptionsSavingWindow isOpen={isOptionsSavingWindow} optionsData={options} 
        onClose={closeOptionsSavingWindow} handleSaving={handleOptionsSaving}/>
        <OptionsChoosingWindow isOpen={isOptionsChoosingWindow} choseOption={setChosenOptions} 
        onClose={closeOptionsChoosingWindow}/>
    
        <div className="form-builder-page-content">
          <FormBuilderSideBar setIsDragging={setIsDragging} setDropAreaPositions ={setDropAreaPositions} 
          removeFormField={removeFormField} removeFormSectionField={removeFormSectionField} duplicateField={handleDuplicateClick}
          updateFormTypeHandler={updateFormTypeHandler} formType={formType}
          editingField={editingField} setEditingField={setEditingField}
          editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField} 
          handleOptionsSaving={handleOptionsSaving} setIsOptionsChoosingWindow={setIsOptionsChoosingWindow}/>
          <div className='form-builder-part'>
           {formFields && 
           <div className='form-constructor' >
              
              { formFields.length === 0 ? 
                <div className='form-constructor-empty-state' ref={drop}>
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
                :
                isLoading ?
                <Spinner/>
                :
                isError ?
                <div className='error-message' >
                  {isError}
                </div>
                :
                formFields.map((field, index) => (
                  <FormBuilderField key={index} field={field} index={index}
                    isDragging={isDragging} setIsDragging={setIsDragging}
                    handleDrop={handleDrop} 
                    updateFormField={updateFormField} removeFormField={removeFormField} 
                    editingField={editingField} setEditingField={setEditingField}
                    editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField}/>
                ))
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
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;