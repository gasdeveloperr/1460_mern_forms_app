import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getCurrentOrganization, getUserId, getUserRole } from './utils';
import DashboardTable from './dashboard_page_components/DashboardTable';
import CorrectiveActionsSideMenu from './corrective_actions_page_components/CorrectiveActionsSideMenu';
import CorrectiveActionsTable from './corrective_actions_page_components/CorrectiveActionsTable';
import CreateCorrectiveActionWindow from './corrective_actions_page_components/CreateCorrectiveActionWindow';

function CorrectiveActionsPage() {

  const navigate = useNavigate();

  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const userRole = getUserRole();
  const currentOrganization = getCurrentOrganization();

  const [isCreatingAction, setIsCreatingAction] = useState(false);

  
  const fetchActions = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/correctiveActions/all`, config);
      console.log('actions taked successfully:', response.data);
      setActions(response.data);
      setIsLoading(false);
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching form, please refresh the page')
        console.error('Error fetching actions:', err);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchActions();
  }, []);

  const deleteActionHandler = async (formId) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    try {
      const response = await axios.delete(`${backend_point}/api/correctiveActions/${formId}`, config);
      
      if (response.status === 200) {
        fetchActions();
      } else {
        setIsError('Error deleting a form, please refresh the page');
      }
    } catch (err) {
      setIsError('Error deleting a form, please refresh the page');
      console.error('Error deleting correctiveActions:', err);
    }
  };

  const openCreatingWindow = () => {
    setIsCreatingAction(true)
  }
  const closeCreatingWindow = () => {
    setIsCreatingAction(false)
  }

  return (
    <div>
      <Header />
      <div className='page-container'>
        <CorrectiveActionsSideMenu createActionHandler={openCreatingWindow}/>
        <div className="table-page-body">
          <div className="table-page-heading">
            <div className="dashboard-page-title">
              Corrective Actions 
            </div>
            {/* <FilterSearchBar
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
            /> */}
          </div>
          <div className="table-page-content">
            <CreateCorrectiveActionWindow isOpen={isCreatingAction} 
            onClose={closeCreatingWindow} setIsLoading={setIsLoading}/>
            {
              isLoading ?
                <Spinner/>
              :  
              isError ?
              <div className='error-message' >
                {isError}
              </div>
              :
              <CorrectiveActionsTable actions={actions}
              deleteActionHandler={deleteActionHandler} 
              setIsLoading={setIsLoading}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default CorrectiveActionsPage;