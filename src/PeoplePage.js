import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getUserRole } from './utils';
import PeopleSideMenu from './people_page_components/PeopleSideMenu';
import PeopleTable from './people_page_components/PeopleTable';
import FilterSearchBar from './people_page_components/FilterSearchBar';
import UserAddingWindow from './people_page_components/UserAddingWindow';
import { toast } from 'react-toastify';

function PeoplePage() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [activeOption, setActiveOption] = useState('users')

  const userRole = getUserRole();


  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState();
  const [isAddingWindowOpen, setIsAddingWindowOpen] = useState(false);
  
  const fetchUsers = async () => {

    const token = getAuthToken();

    // Include the token in the headers
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };


    try {
      const response = await axios.get(`${backend_point}/api/users/all`, config);
      setIsLoading(false);
      setUsers(response.data);
      setFilteredUsers(response.data)
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        toast.error('Error fetching user, please refresh the page.');
        console.error('Error fetching user:', err);
      }
    }
  };
  
  // useEffect(() => {
  //   if(!isLoading){
  //     fetchUsers();
  //   }
  // }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers();
  }, []);


  const handleFilterChange = (filters) => {
    const { role, status, position } = filters;
  
    const filtered = users.filter(user => {
      const roleMatch = role ? user.role === role.toLowerCase() : true;
      const statusMatch = status ? user.status === status.toLowerCase() : true;
      const positionMatch = position ? user.position === position.toLowerCase() : true;
  
      return roleMatch && statusMatch && positionMatch;
    });
  
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (searchTerm) => {
    const searched = users.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.locations.some(location =>
        location.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.primary_contact.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(searched);
  };

  const handleAddingClient = () => {
    setIsAddingWindowOpen(true);
  };

  const handleAddClient = async(newClient) => {

    console.log('handleAddClient : ', newClient)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);

    try {
      const response = await axios.post(`${backend_point}/api/users/new`, newClient, config);
      setIsLoading(false);
      setUsers(response.data);
      setUsers([...response.data, newClient]);
      setFilteredUsers([...response.data, newClient]);
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching client, please refresh the page')
        console.error('Error fetching client:', err);
      }
    }
  };

  return (
    <div >
      <Header />
      <div className='page-container'>
        <PeopleSideMenu activeOption={activeOption} handleAddingClient={handleAddingClient}/>
        <div className="table-page-body">
          <div className="table-page-heading">
            <div className="dashboard-page-title">
              People
            </div>
            <FilterSearchBar
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="table-page-content">
            {
              isLoading ?
                <Spinner/>
              :  
              isError ?
              <div className='error-message' >
                {isError}
              </div>
              :
              <PeopleTable users={filteredUsers}/>
            }
            <UserAddingWindow  isOpen={isAddingWindowOpen} onClose={() => setIsAddingWindowOpen(false)}
              onAddClient={handleAddClient}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeoplePage;