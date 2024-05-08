import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getAuthToken } from './utils';
import { backend_point } from './consts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = ({isModalOpen, setIsModalOpen, 
  chosenBusiness, setUsers, 
  setIsLoading, setIsError}) => {

  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [businessForUser, setBusinessForUser] = useState([])

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchBusiness();
  },[isModalOpen])

  const fetchBusiness = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/business/all`, config);
      setBusinessForUser(response.data);
    } catch (err) {
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching business, please refresh the page')
        console.error('Error fetching business:', err);
      }
    }
  };

  const createNewUser = async(userData) => {
    setIsLoading(true);
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      await axios.post(`${backend_point}/api/users/new`, userData, config);
      setIsLoading(false);
    } catch (err) {
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching business, please refresh the page')
        console.error('Error fetching business:', err);
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

    let businessId = '';

    if(chosenBusiness.id){
      businessId = chosenBusiness.id
    }else{
      businessId = selectedBusiness;
    }
    const formatted_role = userRole.charAt(0).toLowerCase() + userRole.slice(1);

    const userData = {
      email: userEmail,
      name: userName,
      password: userPassword,
      role: formatted_role,
      business: businessId,
    }

    createNewUser(userData);
    
    // Reset form fields
    setUserEmail('');
    setUserName('');
    setUserPassword('');
    setUserRole('User');
    setSelectedBusiness('');
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
                <label htmlFor="userName">Name:</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userEmail">Email:</label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userName">Initial Password:</label>
                <input
                  type="text"
                  id="userPassword"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="userRole">Role:</label>
                <select
                  id="userRole"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="User">User</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              { 
              !chosenBusiness.id &&
                <div className="form-group">
                  <label htmlFor="selectedBusiness">Business:</label>
                  <select
                    id="selectedBusiness"
                    value={selectedBusiness}
                    onChange={(e) => setSelectedBusiness(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select a business</option>
                    {businessForUser.map((business) => (
                      <option key={business._id} value={business._id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
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