import React, { useEffect, useState } from 'react';
import '../clients_page_components/ClientsTable.css';
import { getAuthToken } from '../utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { backend_point, frontend_point } from '../consts';
import { toast } from 'react-toastify';

const PeopleTable = ({ users, setChosenUser }) => {

  
  const template_id = 'template_eot6ltr'
  const service_id = 'service_b50j92k'
  const public_key = '25OYQHNmO94Efm0OU'
  const [isLoading, setIsLoading] = useState(false)


  const navigate = useNavigate();
  
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
        invitation_link: `${frontend_point}/activate/${inviteLink}`,
        user_name: userName, 
        user_email: userEmail, 
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
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        toast.error('Error fetching user, please refresh the page.');
        console.error('Error fetching user:', err);
      }
    }
  };

  
  useEffect(() => {
    console.log('PeopleTable ',users)
  }, [users]);
  return (
    <div className="clients-table-container">
      {
        users &&
        <table className="clients-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Work Email/Username</th>
              <th>Department</th>
              <th>Position</th>
              <th>Work Functions</th>
              <th>Role</th>
              <th>Status</th>
              <th>Details</th>
              <th>Invite</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userIndex) => (
              <tr key={`${user.name}-${userIndex}`}>
                <td>{userIndex+1}.</td>
                <td className="user-name" onClick={() => setChosenUser(user)} style={{ cursor: 'pointer' }}>
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.business}</td>
                <td>{user.position && user.position.toUpperCase().substring(0, 1)+user.position.slice(1)}</td>
                <td>{user.work_functions}</td>
                <td>{user.role && user.role.toUpperCase().substring(0, 1)+user.role.slice(1)}</td>
                <td>{user.status && user.status.toUpperCase().substring(0, 1)+user.status.slice(1)}</td>
                <td>{user.details}</td>
                <td onClick={() => sendInvitationEmail(user.email, user.name)} style={{width: '100px',cursor:'pointer'}}>
                  Send invite
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      }
    </div>
  );
};

export default PeopleTable;