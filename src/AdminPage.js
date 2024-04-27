import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import './AdminPageStyles.css'
import { getAuthToken, getUserRole } from './utils';
import CreateBusinessForm from './CreateBusinessForm';

function AdminPage() {
  const navigate = useNavigate();
  
  const role = getUserRole();

  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [openBusinessModal, setOpenBusinessModal] = useState(false)
  const [openUserModal, setOpenUserModal] = useState(false)

  useEffect(() => {
    console.log('users: ',users)
  }, [users])
  useEffect(() => {
    console.log('businesses: ',businesses)
  }, [businesses])
  
  const fetchBusiness = async () => {

    const token = getAuthToken();

    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/business/all`, config);
      setIsLoading(false);
      setBusinesses(response.data);
    } catch (err) {
      setIsError('Error fetching business, please refresh the page')
      console.error('Error fetching business:', err);
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
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
    } catch (err) {
      setIsError('Error fetching user, please refresh the page')
      console.error('Error fetching users:', err);
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
  

  useEffect(() => {
    setIsLoading(true);
    fetchBusiness();
    fetchUsers();
  }, []);

  const [adminPageState, setAdminPageState] = useState('Business board')

  return (
    <div>
      <Header />
      <div className="admin-page-content">
        <div className="admin-page-side-bar">
          <div className={`admin-page-side-bar-option ${adminPageState === 'Business board' ? 'chosen' :''}`} 
            onClick={() => setAdminPageState('Business board')}>
            Business
          </div>
          <div className="admin-page-side-bar-separator"/>
          <div className={`admin-page-side-bar-option ${adminPageState === 'Users board' ? 'chosen' :''}`} 
            onClick={() => setAdminPageState('Users board')}>
            Users
          </div>
        </div>
        <div className="admin-page-body">
          <div className="admin-page-body-title">
            {adminPageState}
            {
              adminPageState === 'Business board' &&
              <div className="admin-page-create-button" onClick={() => setOpenBusinessModal(true)}>
                Create new business
              </div>
            }
            {
              adminPageState === 'Users board' &&
              <div className="admin-page-create-button" onClick={() => setOpenUserModal(true)}>
                Create new user
              </div>
            }
          </div>
          <div className="admin-page-body-content">
            {adminPageState === 'Business board' ?
              <>
                {businesses.length !==0  && (
                  <table className="business-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Zip</th>
                      <th>Phone</th>
                      <th>Primary Contact</th>
                      <th>Contact Email</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((business, index) => (
                      <tr key={index}>
                        <td>{business.name}</td>
                        <td>{business.address}</td>
                        <td>{business.zip}</td>
                        <td>{business.phone}</td>
                        <td>{business.primary_contact}</td>
                        <td>{business.contact_email}</td>
                        <td>{business.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </>
            :
            adminPageState === 'Users board' ?
              <>
                {users.length !==0 && users.map((user, index) => (
                  <div key={index}>{user.email}</div>
                ))}
              </>
            :
            <></>
            }
          </div>
        </div>
      </div>
      <CreateBusinessForm isModalOpen={openBusinessModal} setIsModalOpen={setOpenBusinessModal} setBusinesses={setBusinesses}
      setIsLoading={setIsLoading} setIsError={setIsError}/>
    </div>
  );
}

export default AdminPage;