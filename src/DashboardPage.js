import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import FormGroupsPage from './FormGroupsPage';

function DashboardPage() {

  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [formGroups, setFormGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const userRole = getUserRole();
  const currentOrganization = getCurrentOrganization();

  const [activeOption, setActiveOption] = useState('forms')

  const [saveMode, setSaveMode] = useState(false);
  const [groupToSave, setGroupToSave] = useState({});

  
  const fetchForms = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/forms/all`, config);
      //console.log('forms taked successfully:', response.data);
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
        fetchForms();
      } else {
        setIsError('Error deleting a form, please refresh the page');
      }
    } catch (err) {
      setIsError('Error deleting a form, please refresh the page');
      console.error('Error deleting forms:', err);
    }
  };

  const deleteFormGroupHandler = async (groupId) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    try {
      const response = await axios.delete(`${backend_point}/api/formGroups/${groupId}`, config);
      
      if (response.status === 200) {
        fetchForms();
      } else {
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
      //console.log('FormGroups taked successfully:', response.data);
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
    setActiveOption('addingformsGroup');
  }
  const closeFormGroupCreatingWindow = () => {
    setIsFormGroupCreatingWindow(false);
    setActiveOption('formsGroups');
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

  const changeActiveOptionHandler = (option) => {
    setActiveOption(option);
    //console.log(activeOption)
  }

  const moveForm = async(dragIndex, hoverIndex, groupIndex) => {
    const updatedGroups = [...formGroups];
    const group = updatedGroups[groupIndex];
  
    const [movedForm] = group.forms.splice(dragIndex, 1);
    group.forms.splice(hoverIndex, 0, movedForm);
    setSaveMode(group._id);
  
    setFormGroups(updatedGroups);
    setGroupToSave(group);
  };
  const changeTitle = (groupIndex, newTitle) => {
    const updatedGroups = [...formGroups];
    updatedGroups[groupIndex].title = newTitle;
    const group = updatedGroups[groupIndex];

    setSaveMode(group._id);
    setFormGroups(updatedGroups);
    setGroupToSave(group);
  };

  const saveFormGroupChanges = async() => {
    //console.log('group to save ',groupToSave)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    setIsLoading(true);
    try {
      await axios.put(`${backend_point}/api/formGroups/updateFormGroup/${groupToSave._id}`, 
        { groupTitle: groupToSave.title, formsOrder: groupToSave.forms }, config);
        setSaveMode('');
        setGroupToSave('');
        getFormGroupsHandler();
    } catch (error) {
      if (error.response) {
        console.error('Error changing order in formGroup:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  

  return (
    <div>
      <Header />
      <div className='page-container'>
        <DashboardSideMenu activeOption={activeOption} 
        handleAddingForm={() => createFormHandler()}
        handleCreatingFormGroup={handleCreatingFormGroup}
        changeActiveOptionHandler={changeActiveOptionHandler}/>
        {
          activeOption === 'formsGroups' ?
          <FormGroupsPage forms={forms} formGroups={formGroups} 
          deleteFormGroupHandler={deleteFormGroupHandler} 
          chooseFormToAddIntoGroup={chooseFormToAddIntoGroup} chooseFormToRemoveFromGroup={handleRemoveFromGroup}
          changeTitle={changeTitle} moveForm={moveForm} 
          isLoading={isLoading} setIsLoading={setIsLoading} isSaveMode={saveMode} 
          saveFormGroupChanges={saveFormGroupChanges} getFormGroupsHandler={getFormGroupsHandler}/>
          :
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
              chooseFormToAddIntoGroup={chooseFormToAddIntoGroup}/>
            }
          </div>
        </div>
        }
      </div>
    </div>
  );
}

export default DashboardPage;