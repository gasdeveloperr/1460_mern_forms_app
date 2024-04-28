import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import './AdminPageStyles.css'
import { getAuthToken, getUserRole } from './utils';
import CreateBusinessForm from './CreateBusinessForm';
import CreateUserForm from './CreateUserForm';
import { toast } from 'react-toastify';

function AdminPage() {
  
  const template_id = 'template_eot6ltr'
  const service_id = 'service_b50j92k'
  const public_key = '25OYQHNmO94Efm0OU'


  const navigate = useNavigate();
  
  const role = getUserRole();

  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [openBusinessModal, setOpenBusinessModal] = useState(false)
  const [openUserModal, setOpenUserModal] = useState(false)

  useEffect(() => {
    //console.log('users: ',users)
  }, [users])


  useEffect(() => {
    if(businessChosen.id && businesses.length !==0){
      console.log('debug businesses.find : ', businesses)
      // const updatedChosenBusiness = businesses.find((business) => business._id === businessChosen.id);
      // setBusinessChosen(updatedChosenBusiness);
    }
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
    if(!isLoading){
      fetchBusiness();
      fetchUsers();
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    fetchBusiness();
    fetchUsers();
  }, []);

  const [adminPageState, setAdminPageState] = useState('Business board')
  const [businessChosen, setBusinessChosen] = useState('')


  const userLookup = users.reduce((lookup, user) => {
    lookup[user._id] = user;
    return lookup;
  }, {});
  
  const businessLookup = businesses.reduce((lookup, business) => {
    lookup[business._id] = business;
    return lookup;
  }, {});

  const sendInvitationEmail = async (userEmail, userName) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    const emailToSend ={email: userEmail}

    try {
      const response = await axios.post(`${backend_point}/api/users/invite`, emailToSend, config);
      const inviteLink = response.data;
      const emailData = {
        invitation_link: `${backend_point}/invite/${inviteLink}`,
        user_name: userName, 
      }
      
      toast.promise( () => 
        emailjs.send(service_id, template_id, emailData, public_key),
        {
          pending: 'Sending invitation..',
          success: 'Invitation sent',
          error: 'Promise rejected 🤯'
        }
      )
      setIsLoading(false);
    } catch (err) {
      setIsError('Error inviting user, please refresh the page')
      console.error('Error fetching users:', err);
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-page-content">
        <div className="admin-page-side-bar">
          <div className={`admin-page-side-bar-option ${adminPageState === 'Business board' ? 'chosen' :''}`} 
            onClick={() => {setBusinessChosen(''); setAdminPageState('Business board')}}>
            Business
          </div>
          <div className="admin-page-side-bar-separator"/>
          <div className={`admin-page-side-bar-option ${adminPageState === 'Users board' ? 'chosen' :''}`} 
            onClick={() => {setBusinessChosen(''); setAdminPageState('Users board')}}>
            Users
          </div>
        </div>
        <div className="admin-page-body">
          <div className="admin-page-body-title">
            {
              businessChosen == '' ?
              <>
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
              </>
              :
              <>
                {businessChosen.name}
                  <div className="admin-page-create-button" onClick={() => setOpenUserModal(true)}>
                    Add new user
                  </div>

              </>
            }
            
          </div>
          <div className="admin-page-body-content">
            {
              businessChosen.id ?
              <>
                {businessChosen.users.length !==0  ? (
                  <table className="business-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Business</th>
                      </tr>
                    </thead>
                    <tbody>
                    {businessChosen.users.map((userId, index) => {
                      const user = users.find((u) => u._id === userId);
                      if (user) {
                        const business = user.business ? businessLookup[user.business] : null;
                        return (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                            <td>{user.business ? businesses.find((b) => b._id === user.business).name : '-'}</td>
                            <td>
                              <div className='send-user-invite-button' onClick={() => sendInvitationEmail(user.email, user.name)}>
                                Send invitation email
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                    </tbody>
                  </table>
                )
                :
                  <div>There are no users yet</div>
                }
              </>
              :
              <>
                {adminPageState === 'Business board' ?
                  <>
                    {businesses.length !==0  ? (
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
                          <tr key={index} onClick={() => setBusinessChosen({name: business.name, id: business._id, users: business.users})}>
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
                    )
                    :
                      <div>There are no business yet</div>
                    }
                  </>
                :
                adminPageState === 'Users board' ?
                  <>
                    {users.length !==0 ? (
                      <table className="business-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Business</th>
                            <th>Invitation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <>
                            <tr key={index}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                              <td>{user.business ? businesses.find((b) => b._id === user.business).name : '-'}</td>
                              <td>
                                <div className='send-user-invite-button' onClick={() => sendInvitationEmail(user.email, user.name)}>
                                  Send invitation email
                                </div>
                              </td>
                            </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    )
                    :
                      <div>There are no users yet</div>
                    }
                  </>
                :
                <></>
                }
              </>
            }
          </div>
        </div>
      </div>
      <CreateUserForm isModalOpen={openUserModal} setIsModalOpen={setOpenUserModal} 
      chosenBusiness={businessChosen} setUsers={setUsers}
      setIsLoading={setIsLoading} setIsError={setIsError}/>
      <CreateBusinessForm isModalOpen={openBusinessModal} setIsModalOpen={setOpenBusinessModal} 
      setBusinesses={setBusinesses}
      setIsLoading={setIsLoading} setIsError={setIsError}/>
    </div>
  );
}

export default AdminPage;