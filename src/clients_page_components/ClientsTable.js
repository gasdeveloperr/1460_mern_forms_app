import React, { useState } from 'react';
import './ClientsTable.css';
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg'

const ClientsTable = ({ clients, selectedClient, setSelectedClient, goBack }) => {

  const handleClientClick = (client) => {
    setSelectedClient(client);
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
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, clientIndex) => (
              client.locations.map((location, locationIndex) => (
                <tr
                  key={`${client.name}-${locationIndex}`}
                  onClick={() => handleClientClick(client)} // Set the selected client on click
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
                  <td>{location.contact_email}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      )}

      {/* Render the table for the selected client */}
      {selectedClient && (
        <div className="client-details-table">
          <div className="client-table-title">
            <button className="client-table-go-back" onClick={() => goBack()}>
              <img src={arrow_menu_icon} />
            </button>
            <h2>{selectedClient.name}</h2>
          </div>
          <table className="clients-table">
            <thead>
              <tr>
                <th></th>
                <th>Facility</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {selectedClient.locations.map((location, index) => (
                <tr key={`${selectedClient._id}-${index}`}>
                  <td className="client-index">
                    {index+1}.
                  </td>
                  <td>{location.facility}</td>
                  <td>{location.address}</td>
                  <td>{location.primary_contact}</td>
                  <td>{location.phone}</td>
                  <td>{location.contact_email}</td>
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
