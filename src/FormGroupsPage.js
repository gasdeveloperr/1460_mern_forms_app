import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import arrow_menu_icon from './icons/arrow-side-menu-icon.svg';
import FormGroupsTable from './dashboard_page_components/FormGroupsTable';
import FormGroupCoverPageEditor from './dashboard_page_components/FormGroupCoverPageEditor';
import { getAuthToken } from './utils';
import axios from 'axios';
import { backend_point } from './consts';
import FormGroupSubsChoser from './dashboard_page_components/FormGroupSubsChoser';
import FormGroupPreview from './dashboard_page_components/FormGroupPreview';

const FormGroupsPage = ({ forms, formGroups, changeTitle, moveForm, 
  isLoading, setIsLoading, isSaveMode, saveFormGroupChanges, 
  deleteFormGroupHandler, chooseFormToAddIntoGroup, 
  chooseFormToRemoveFromGroup, getFormGroupsHandler}) => {
  
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFormSubs, setSelectedFormSubs] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isChoserOpen, setIsChoserOpen] = useState(false);

  const [formSubs, setFormSubs] = useState([]);

  const [formIdToUpdateSub, setFormIdToUpdateSub] = useState('')

  const handleOpenEditor = (group) => {
    setSelectedGroup(group);
    setIsEditorOpen(true);
  };
  const handleOpenGroupPreview = (group) => {
    setSelectedGroup(group);
    setIsPreviewOpen(true);
  };
  const handleOpenChoser = async(group, form) => {
    console.log(form)
    setFormIdToUpdateSub(form._id)
    setSelectedGroup(group);

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
  
    try {
      const submFormsResponse = await axios.get(`${backend_point}/api/subm_forms/original_formId/${form._id}`, config);
      console.log('submFormsResponse.data : ', submFormsResponse.data);
      setSelectedFormSubs(submFormsResponse.data)
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsChoserOpen(true);
  };

  const handleCloseSubPage = () => {
    setSelectedGroup(null);
    setIsPreviewOpen(false);
    setIsEditorOpen(false);
    setIsChoserOpen(false);
  };
  
  const getSubmissionsHandler = async() => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);
    try {
      const submissionsResponse = await axios.get(`${backend_point}/api/subm_forms/all`, config);
      setFormSubs(submissionsResponse.data)
      setIsLoading(false);
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

  useEffect(() => {
    getSubmissionsHandler()
  }, [])
  
  const updateGroupCoverPageHandler = async(updatedCoverPage) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);
    console.log(' selectedGroup._id, updatedCoverPage ', selectedGroup._id, updatedCoverPage)
    try {
      await axios.put(`${backend_point}/api/formGroups/updateCoverPage/${selectedGroup._id}`, 
        {updatedCoverPage: updatedCoverPage}, config);
        handleCloseSubPage();
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
  
  const updateGroupSubmissionsHandler = async(chosenSubObject) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);
    const requestData = {...chosenSubObject, formId: formIdToUpdateSub}
    console.log(' requestData ', requestData)
    try {
      await axios.put(`${backend_point}/api/formGroups/updateFormSub/${selectedGroup._id}`, 
        requestData, config);
        handleCloseSubPage();
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

  return (
    <>
      {
      isLoading ?
        <Spinner/>
      :
      isEditorOpen ? 
        <div className="form-group-cover-page-container">
          <div className="go-back-button" onClick={handleCloseSubPage}>
            <img src={arrow_menu_icon} alt="Go Back" />
          </div>
          <FormGroupCoverPageEditor
            formGroupCoverPage={selectedGroup?.cover_page || {}}
            updateFormGroup={updateGroupCoverPageHandler}
          />
        </div>
      :
      isPreviewOpen ? 
        <div className="form-group-cover-page-container">
          <div className="go-back-button" onClick={handleCloseSubPage}>
            <img src={arrow_menu_icon} alt="Go Back" />
          </div>
          <FormGroupPreview
            formGroup={selectedGroup}
            formSubs={formSubs}
            updateFormGroup={updateGroupSubmissionsHandler}
          />
        </div>
      :
      isChoserOpen && selectedFormSubs ? 
        <div className="form-group-cover-page-container">
          <div className="go-back-button" onClick={handleCloseSubPage}>
            <img src={arrow_menu_icon} alt="Go Back" />
          </div>
          <FormGroupSubsChoser
            chosenFormSubs={selectedFormSubs}
            updateFormGroup={updateGroupSubmissionsHandler}
          />
        </div>
      :
      <div className="table-page-body">
        <div className="table-page-heading">
          <div className="dashboard-page-title">
            Groups
          </div>
          {/* <FilterSearchBar
            onFilterChange={handleFilterChange} 
            onSearchChange={handleSearchChange}
          /> */}
        </div>
        <div className="table-page-content">
          <FormGroupsTable forms={forms} formGroups={formGroups} 
          deleteFormGroupHandler={deleteFormGroupHandler} 
          chooseFormToAddIntoGroup={chooseFormToAddIntoGroup} chooseFormToRemoveFromGroup={chooseFormToRemoveFromGroup}
          changeTitle={changeTitle} moveForm={moveForm} 
          isSaveMode={isSaveMode} saveFormGroupChanges={saveFormGroupChanges}
          handleOpenEditor={handleOpenEditor} handleOpenGroupPreview={handleOpenGroupPreview} handleOpenSubChoser={handleOpenChoser}/>
        </div>
      </div>
      }
    </>
  );
}

export default FormGroupsPage;