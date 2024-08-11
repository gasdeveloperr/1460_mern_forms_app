import React, { useState } from 'react';
import '../clients_page_components/ClientAddingWindow.css';

const ClientAddingWindow = ({ isOpen, onClose, onAddClient }) => {
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('active');
  const [locations, setLocations] = useState([{
    facility: '',
    address: '',
    primary_contact: '',
    phone: '',
    contact_email: ''
  }]);

  const handleLocationChange = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const addLocation = () => {
    setLocations([...locations, {
      facility: '',
      address: '',
      primary_contact: '',
      phone: '',
      contact_email: ''
    }]);
  };

  const removeLocation = (index) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      name: clientName,
      status,
      locations
    };
    console.log('handleSubmit : ', newClient)
    onAddClient(newClient);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="client-adding-overlay">
      <div className="client-adding-window">
        <h2>Add New Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clientName">Client Name:</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <h3>Locations</h3>
          {locations.map((location, index) => (
            <div key={index} className="location-form">
              <h4>Location {index + 1}</h4>
              {Object.keys(location).map(field => (
                <div key={field} className="form-group">
                  <label htmlFor={`${field}-${index}`}>{field.replace('_', ' ')}:</label>
                  <input
                    type="text"
                    id={`${field}-${index}`}
                    value={location[field]}
                    onChange={(e) => handleLocationChange(index, field, e.target.value)}
                    required
                  />
                </div>
              ))}
              {locations.length > 1 && (
                <button type="button" onClick={() => removeLocation(index)}>Remove Location</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLocation}>Add Location</button>
          <div className="form-actions">
            <button type="submit">Add Client</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientAddingWindow;