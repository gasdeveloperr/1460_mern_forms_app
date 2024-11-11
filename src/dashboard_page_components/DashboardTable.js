import React from 'react';
import '../clients_page_components/ClientsTable.css';
import './DashboardPage.css';
import { formatDate, getUserRole } from '../utils';
import trash_icon from '../icons/trash-can-white.svg'
import open_icon from '../icons/open-form-icon.svg'
import edit_icon from '../icons/edit-form-icon.svg'

const DashboardTable = ({ forms, formGroups, deleteFormHandler, chooseFormToAddIntoGroup, chooseFormToRemoveFromGroup }) => {
  const userRole = getUserRole();

  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Edit</th>
            <th>Fill</th>
            <th>Results</th>
            <th>Last changed</th>
            <th>Group</th>
            <th></th>
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
                <td className="form-index">
                  {formIndex+1}.
                </td>
                <td className="form-name" >
                  <a href={`/forms/builder/${form._id}`}>{form.title}</a>
                </td>
                <td className='forms-action' align="center">
                  {(userRole === 'editor' || userRole ==='admin') &&
                    <a href={`/forms/builder/${form._id}`}>
                      <img src={edit_icon}  className="forms-action-edit-img"/>
                    </a>
                  }
                </td>
                <td className='forms-action' align="center">
                  <a href={`/forms/live/${form._id}`}>
                    <img src={open_icon} className="forms-action-open-img"/>
                  </a>
                </td>
                <td className="form-name" >
                  <a href={`/forms/results/${form._id}`}>See results</a>
                </td>
                <td className="client-index">
                  {formatDate(form.last_changed)}
                </td>
                <td className="forms-action" align="center">
                  {(userRole === 'editor' || userRole === 'admin') && (
                    form.groupId ? (
                      <div style={{display:'flex', gap: '12px', alignItems:'center', justifyContent:'flex-start'}}>
                        <span style={{fontWeight: '600'}}>
                          {formGroups.find(formGroup => formGroup._id === form.groupId)?.title || "Group Not Found"}
                        </span>
                        <div className="table-action-button" onClick={() => chooseFormToRemoveFromGroup(form._id, form.groupId)}>
                          Remove from group
                        </div>
                      </div>
                    ) : (
                      <div className="table-action-button" onClick={() => chooseFormToAddIntoGroup(form._id)}>
                        Add into the group
                      </div>
                    )
                  )}
                </td>
                <td className='forms-action' align="center"> 
                  {(userRole === 'editor' || userRole ==='admin') &&
                    <div className="delete" onClick={() => deleteFormHandler(form._id)}>
                      <img src={trash_icon} className="remove-icon"/>
                    </div>
                  }
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;