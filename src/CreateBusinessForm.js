import { useState } from 'react';
import Modal from 'react-modal';
import { getAuthToken } from './utils';
import { backend_point } from './consts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateBusinessForm = ({isModalOpen, setIsModalOpen, setIsLoading, setIsError}) => {

  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createNewBusiness = async(businessData) => {

    const token = getAuthToken();
    
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);

    try {
      const response = await axios.post(`${backend_point}/api/business/new`, businessData, config);
      setIsLoading(false);
    } catch (err) {
      if(err.response && err.response.status === 401){
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

    if (!emailPattern.test(contactEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Perform form submission logic here
    console.log('Business Name:', businessName);
    console.log('Address:', address);
    console.log('Zip:', zip);
    console.log('Phone:', phone);
    console.log('Primary Contact:', primaryContact);
    console.log('Contact Email:', contactEmail);
    console.log('Description:', description);

    const businessData = {
      name: businessName,
      address: address, 
      zip: zip,
      phone: phone,
      primary_contact: primaryContact,
      contact_email: contactEmail,
      description: description
    }

    createNewBusiness(businessData)
    
    
    // Reset form fields
    setBusinessName('');
    setAddress('');
    setZip('');
    setPhone('');
    setPrimaryContact('');
    setContactEmail('');
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
            <h2>Create Business</h2>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="businessName">Business Name:</label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Address, City, Zip:</label>
                <input
                  type="text"
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="primaryContact">Primary Contact:</label>
                <input
                  type="text"
                  id="primaryContact"
                  value={primaryContact}
                  onChange={(e) => setPrimaryContact(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email:</label>
                <input
                  type="email"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description (optional):</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className='modal-button' type="submit">Create</button>
                <button className='usual-button' type="cancel" onClick={closeModal}>
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

export default CreateBusinessForm;