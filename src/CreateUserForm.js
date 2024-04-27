import { useState } from 'react';
import Modal from 'react-modal';
import { getAuthToken } from './utils';
import { backend_point } from './consts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = ({isModalOpen, setIsModalOpen, setUsers, setIsLoading, setIsError}) => {

  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createNewUser = async(userData) => {

    const token = getAuthToken();
    
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.post(`${backend_point}/api/user/new`, userData, config);
      setIsLoading(false);
      setUsers(response.data);
    } catch (err) {
      setIsError('Error fetching user, please refresh the page')
      console.error('Error fetching user:', err);
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(userEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Perform form submission logic here
    console.log('User email:', userEmail);
    console.log('User Name:', userName);

    const userData = {
      email: userEmail,
      name: userName,
      role: userRole,
    }

    createNewUser(userData)
    
    
    // Reset form fields
    setUserName('');
    setDescription('');
    closeModal();
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create User</h2>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contactEmail">User Email:</label>
                <input
                  type="email"
                  id="contactEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userName">User Name:</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="submit">Create</button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUserForm;