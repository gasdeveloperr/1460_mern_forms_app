import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getCurrentOrganization, getUserId, getUserRole } from './utils';
import DashboardSideMenu from './dashboard_page_components/DashboardSideMenu';
import DashboardTable from './dashboard_page_components/DashboardTable';
import FormGroupSavingWindow from './form_group_components/FormGroupSavingWindow';
import FormGroupChoosingWindow from './form_group_components/FormGroupChoosingWindow';

function DashboardPage() {

  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [formGroups, setFormGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const userRole = getUserRole();
  const currentOrganization = getCurrentOrganization();

  const [activeOption, setActiveOption] = useState('clients')

  
  const fetchForms = async () => {

    const token = getAuthToken();

    // Include the token in the headers
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };


    try {
      const response = await axios.get(`${backend_point}/api/forms/all`, config);
      console.log('forms taked successfully:', response.data);
      setForms(response.data);
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

  useEffect(() => {
    setIsLoading(true);
    fetchForms();
    getFormGroupsHandler();
    
  }, []);


  const createFormHandler = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const newForm = {
        title: 'New form',
        fields: [],
        organizations: [currentOrganization],
      };
      const response = await axios.post(`${backend_point}/api/forms/new`, newForm, config);
      const formData = response.data;
      // Navigate to the newly created form route
      navigate(`/forms/builder/${formData._id}`);

    } catch (err) {
      console.log('we have error on front');
      setIsError('Error creating form, please try again');
      console.error('Error creating form:', err);
    }
  };

  const deleteFormHandler = async (formId) => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.delete(`${backend_point}/api/forms/${formId}`, config);
      
      if (response.status === 200) {
        // Delete request was successful
        fetchForms();
      } else {
        // Handle other response statuses if needed
        setIsError('Error deleting a form, please refresh the page');
      }
    } catch (err) {
      setIsError('Error deleting a form, please refresh the page');
      console.error('Error deleting forms:', err);
    }
  };

  
  const getFormGroupsHandler = async(e) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    try {
      const response = await axios.get(`${backend_point}/api/formGroups/all`, config);
      console.log('FormGroups taked successfully:', response.data);
      setIsLoading(false);
      setFormGroups(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error saving formGroups:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  const [chosenFormToAddIntoGroup, setChosenFormToAddIntoGroup] = useState('');
  
  const [isFormGroupChanging, setIsFormGroupChanging] = useState(false);

  const [isFormGroupCreatingWindow, setIsFormGroupCreatingWindow] = useState(false);
  const [isFormGroupChoosingWindow, setIsFormGroupChoosingWindow] = useState(false);

  const handleCreatingFormGroup = () => {
    setIsFormGroupCreatingWindow(true);
  }
  const closeFormGroupCreatingWindow = () => {
    setIsFormGroupCreatingWindow(false);
  }
  const closeFormGroupChoosingWindow = () => {
    setIsFormGroupChoosingWindow(false);
    setIsFormGroupChoosingWindow('');
  }
  const chooseFormToAddIntoGroup = (formId) => {
    setIsFormGroupChoosingWindow(true);
    setChosenFormToAddIntoGroup(formId);
  }
  const addFormIntoGroupHandler = async(formGroupId) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);
    try {
      await axios.put(`${backend_point}/api/formGroups/addForm/${formGroupId}`, 
        {newForm: chosenFormToAddIntoGroup}, config);
        closeFormGroupChoosingWindow();
        fetchForms();
        getFormGroupsHandler();
    } catch (error) {
      if (error.response) {
        console.error('Error saving formGroups:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  }
  const handleRemoveFromGroup = async(formId, formGroupId) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);
    try {
      await axios.put(`${backend_point}/api/formGroups/removeForm/${formGroupId}`, 
        {formId: formId}, config);
      fetchForms();
      getFormGroupsHandler();
    } catch (error) {
      if (error.response) {
        console.error('Error removing from formGroup:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  return (
    <div>
      <Header />
      <div className='page-container'>
        <DashboardSideMenu activeOption={activeOption} 
        handleAddingForm={() => createFormHandler()}
        handleCreatingFormGroup={handleCreatingFormGroup}/>
        <div className="table-page-body">
          <div className="table-page-heading">
            <div className="dashboard-page-title">
              Assessments
            </div>
            {/* <FilterSearchBar
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
            /> */}
          </div>
          <div className="table-page-content">
            <FormGroupSavingWindow isOpen={isFormGroupCreatingWindow}
            onClose={closeFormGroupCreatingWindow} handleSaving={handleCreatingFormGroup}/>
            <FormGroupChoosingWindow isOpen={isFormGroupChoosingWindow} choseOption={()=>{}} 
            formGroups={formGroups} isFormGroupChanging={isFormGroupChanging}
            chosenFormToAddIntoGroup={chosenFormToAddIntoGroup} addFormIntoGroupHandler={addFormIntoGroupHandler}
            onClose={closeFormGroupChoosingWindow}/>
            {
              isLoading ?
                <Spinner/>
              :  
              isError ?
              <div className='error-message' >
                {isError}
              </div>
              :
              <DashboardTable forms={forms} formGroups={formGroups} 
              deleteFormHandler={deleteFormHandler} 
              chooseFormToAddIntoGroup={chooseFormToAddIntoGroup} chooseFormToRemoveFromGroup={handleRemoveFromGroup}/>
            }
          </div>
        </div>
      </div>
      {/* <div className="dashboard-body">
      <div className="dashboard-page-heading">
        <div className="dashboard-page-title">
          Welcome to Dashboard
        </div>
        {
          (userRole === 'admin' || userRole ==='editor') && 
          <div className="new-form-btn" onClick={() => createFormHandler()}>
            Create new Form
          </div>
        }
      </div>
      <div className="dashboard-page-content">
        <div className="dashboard-form-list">
          {
            isLoading ?
              <Spinner/>
            :  
            isError ?
            <div className='error-message' >
              {isError}
            </div>
            :
            forms.map((form) => (
              <div className="form-list-item" key={form._id}>
                {form.title}
                <div className="form-actions">
                  {(userRole === 'editor' || userRole ==='admin') &&
                    <a href={`/forms/builder/${form._id}`} className="edit">
                      Edit
                    </a>
                  }
                  <a href={`/forms/live/${form._id}`} className="fill">
                    Use
                  </a>
                  {(userRole === 'editor' || userRole ==='admin') &&
                    <div className="delete" onClick={() => deleteFormHandler(form._id)}>
                      <img src={trash_icon} className="remove-icon"/>
                    </div>
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
      </div> */}
    </div>
  );
}

export default DashboardPage;