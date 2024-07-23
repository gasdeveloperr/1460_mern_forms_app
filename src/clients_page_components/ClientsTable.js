import React from 'react';
import './ClientsTable.css';

const ClientsTable = ({ clients }) => {
  return (
    <div className="clients-table-container">
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
              <tr key={`${client.name}-${locationIndex}`}>
                {locationIndex === 0 && (
                  <>
                    <td className="client-index" rowSpan={client.locations.length}>
                      {clientIndex+1}.
                    </td>
                    <td className="client-name" rowSpan={client.locations.length}>
                      <a href={`/client/${client.name}`}>{client.name}</a>
                    </td>
                    <td className="client-status" align="center"  rowSpan={client.locations.length}>
                      <span className={`status-indicator ${client.status.toLowerCase()}`}></span>
                      {/* {client.status} */}
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
    </div>
  );
};

export default ClientsTable;