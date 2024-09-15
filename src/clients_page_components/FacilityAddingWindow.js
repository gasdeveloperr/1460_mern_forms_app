import React, { useState } from 'react';
import './ClientAddingWindow.css';

const FacilityAddingWindow = ({ isOpen, onClose, onAddFacility  }) => {
  const [location, setLocation] = useState({
    facility: '',
    address: '',
    primary_contact: '',
    phone: '',
    contact_email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFacility = location;
    console.log('handleSubmit : ', newFacility)
    onAddFacility(newFacility);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="window-overlay">
      <div className="window-content">
        <h2>Add New Facility</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="facilityName">Facility Name:</label>
            <input
              type="text"
              id="facilityName"
              value={location.facility}
              onChange={(e) => setLocation((prev) => ({...prev, facility: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facilityAddress">Facility Address:</label>
            <input
              type="text"
              id="facilityAddress"
              value={location.address}
              onChange={(e) => setLocation((prev) => ({...prev, address: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facilityPrimary_contact">Facility Primary contact:</label>
            <input
              type="text"
              id="facilityPrimary_contact"
              value={location.primary_contact}
              onChange={(e) => setLocation((prev) => ({...prev, primary_contact: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facilityPhone">Facility Phone:</label>
            <input
              type="text"
              id="facilityPhone"
              value={location.phone}
              onChange={(e) => setLocation((prev) => ({...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facilityContact_email">Facility Contact email:</label>
            <input
              type="text"
              id="facilityContact_email"
              value={location.contact_email}
              onChange={(e) => setLocation((prev) => ({...prev, contact_email: e.target.value }))}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Add New Facility</button>
            <button type="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityAddingWindow;