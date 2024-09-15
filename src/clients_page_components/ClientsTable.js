import React, { useState, useEffect } from 'react';
import './ClientsTable.css';
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg';

const ClientsTable = ({ clients, selectedClient, setSelectedClient, editClientHandler, goBack }) => {
  const [editingClient, setEditingClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setEditingClient({ ...selectedClient });
      setIsEditing(false); // Reset editing state when a new client is selected
    }
  }, [selectedClient]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  const handleClientNameChange = (value) => {
    setEditingClient({ ...editingClient, name: value });
  };

  const handleClientPropertyChange = (index, property, value) => {
    const updatedLocations = editingClient.locations.map((location, locIndex) => 
      locIndex === index ? { ...location, [property]: value } : location
    );
    setEditingClient({ ...editingClient, locations: updatedLocations });
  };

  const handleChangesDiscard = () => {
    setEditingClient({ ...selectedClient }); // Reset to original client data
    setIsEditing(false);
  };

  const submitClientPropertyChange = () => {
    editClientHandler(editingClient);
    setIsEditing(false);
  };

  return (
    <div className="clients-table-container">
      {clients && !selectedClient && (
        <table className="clients-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Status</th>
              <th>Facility</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, clientIndex) => (
              client.locations.map((location, locationIndex) => (
                <tr
                  key={`${client.name}-${locationIndex}`}
                  onClick={() => handleClientClick(client)}
                  style={{ cursor: 'pointer' }}
                >
                  {locationIndex === 0 && (
                    <>
                      <td className="client-index" rowSpan={client.locations.length}>
                        {clientIndex + 1}.
                      </td>
                      <td className="client-name" rowSpan={client.locations.length}>
                        {client.name}
                      </td>
                      <td className="client-status" align="center" rowSpan={client.locations.length}>
                        <span className={`status-indicator ${client.status.toLowerCase()}`}></span>
                      </td>
                    </>
                  )}
                  <td>{location.facility}</td>
                  <td>{location.address}</td>
                  <td>{location.primary_contact}</td>
                  <td>{location.phone}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      )}

      {selectedClient && editingClient && (
        <div className="client-details-table">
          <div className="client-table-title">
            <button className="client-table-go-back" onClick={goBack}>
              <img src={arrow_menu_icon} alt="Go Back" />
            </button>
            { isEditing ? (
                <input
                className='client-name-input'
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => handleClientNameChange(e.target.value)}
                />
              ) : 
              <h2>{selectedClient.name}</h2>
            }
            {!isEditing ? (
              <button className="edit-client-button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            ) : (
              <>
                <button className="submit-client-changes" onClick={submitClientPropertyChange}>
                  Save Changes
                </button>
                <button className="discard-client-changes" onClick={handleChangesDiscard}>
                  Discard Changes
                </button>
              </>
            )}
          </div>
          <table className="clients-table">
            <thead>
              <tr>
                <th></th>
                <th>Facility</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {editingClient.locations.map((location, index) => (
                <tr key={`${editingClient._id}-${index}`}>
                  <td className="client-index">{index + 1}.</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location.facility}
                        onChange={(e) => handleClientPropertyChange(index, 'facility', e.target.value)}
                      />
                    ) : (
                      location.facility
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location.address}
                        onChange={(e) => handleClientPropertyChange(index, 'address', e.target.value)}
                      />
                    ) : (
                      location.address
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location.primary_contact}
                        onChange={(e) => handleClientPropertyChange(index, 'primary_contact', e.target.value)}
                      />
                    ) : (
                      location.primary_contact
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location.phone}
                        onChange={(e) => handleClientPropertyChange(index, 'phone', e.target.value)}
                      />
                    ) : (
                      location.phone
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
