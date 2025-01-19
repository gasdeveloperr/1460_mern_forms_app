import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getCurrentOrganization, getUserId, getUserRole } from './utils';
import DashboardTable from './dashboard_page_components/DashboardTable';
import DocumentsSideMenu from './documents_page_components/DocumentsSideMenu';
import DocumentsManagement from './documents_page_components/DocumentsManagement';

function DocumentsPage() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const userRole = getUserRole();
  const userId = getUserId();
  const organizationId = getCurrentOrganization()

  const [files, setFiles] = useState([])

  const [activeOption, setActiveOption] = useState('clients')

  const fetchUser = async () => {

    const token = getAuthToken();

    // Include the token in the headers
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    const backend_request = (userRole === 'admin' || userRole === 'manager') ? 
    `/clients/${organizationId}` 
    : `/users/${userId}`;

    try {
      const response = await axios.get(`${backend_point}/api${backend_request}`, config);
      setIsLoading(false);
      setFiles(response.data.files);
      console.log('user files ',response.data.files)
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching user, please refresh the page')
        console.error('Error fetching user:', err);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUser();
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
        fetchUser();
      } else {
        // Handle other response statuses if needed
        setIsError('Error deleting a form, please refresh the page');
      }
    } catch (err) {
      setIsError('Error deleting a form, please refresh the page');
      console.error('Error deleting forms:', err);
    }
  };

  return (
    <div>
      <Header />
      <div className='page-container'>
        <DocumentsSideMenu activeOption={activeOption} handleAddingClient={()=>{}}/>
        <div className="table-page-body">
          <div className="table-page-heading">
            <div className="dashboard-page-title">
              Documents
            </div>
            {/* <FilterSearchBar
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
            /> */}
          </div>
          <div className="folders-page-content">
            {
              isLoading ?
                <Spinner/>
              :  
              isError ?
              <div className='error-message' >
                {isError}
              </div>
              :
              <DocumentsManagement files={files} updateUserData={fetchUser} setIsLoading={setIsLoading}/>
              // forms.map((form) => (
              //   <div className="form-list-item" key={form._id}>
              //     {form.title}
              //     <div className="form-actions">
              //       {(userRole === 'editor' || userRole ==='admin') &&
              //         <a href={`/forms/builder/${form._id}`} className="edit">
              //           Edit
              //         </a>
              //       }
              //       <a href={`/forms/live/${form._id}`} className="fill">
              //         Use
              //       </a>
              //       {(userRole === 'editor' || userRole ==='admin') &&
              //         <div className="delete" onClick={() => deleteFormHandler(form._id)}>
              //           <img src={trash_icon} className="remove-icon"/>
              //         </div>
              //       }
              //     </div>
              //   </div>
              // ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;