import React from 'react';
import '../clients_page_components/ClientsTable.css';

const DashboardTable = ({ forms }) => {
  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Status</th>
            {/* <th>Facility</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Email</th> */}
          </tr>
        </thead>
        <tbody>
          {forms.map((form, formIndex) => (
              <tr key={`${form._id}`}>
                <td className="client-index">
                  {formIndex+1}.
                </td>
                <td className="client-name" >
                  <a href={`/forms/builder/${form._id}`}>{form.title}</a>
                </td>
                <td className="client-status" align="center">
                  {/* <span className={`status-indicator ${form.status.toLowerCase()}`}></span> */}
                  {/* {form.status} */}
                </td>
                <td></td>
                <td></td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;