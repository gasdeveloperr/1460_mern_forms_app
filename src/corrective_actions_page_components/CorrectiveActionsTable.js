import React, { useState } from 'react';
import '../clients_page_components/ClientsTable.css';
import '../dashboard_page_components/DashboardPage.css';
import { formatDate, getAuthToken, getUserRole } from '../utils';
import trash_icon from '../icons/trash-can-white.svg';
import save_icon from '../icons/save-green-icon.svg';
import cancel_icon from '../icons/cancel-red-icon.svg';
import { backend_point } from '../consts';
import axios from 'axios';

const CorrectiveActionsTable = ({ actions, deleteActionHandler, setIsLoading }) => {
  const userRole = getUserRole();

  const [editableAction, setEditableAction] = useState(null); // Tracks which action is being edited
  const [editValues, setEditValues] = useState({}); // Tracks current input values for text and logic

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const startEditing = (action) => {
    setEditableAction(action._id);
    setEditValues({ text: action.text, logic: action.logic });
  };
  const cancelEditing = () => {
    setEditableAction(null);
    setEditValues({});
  };

  const saveActionChanges = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };

    setIsLoading(true);
    console.log(editValues)
    try {
      await axios.put(`${backend_point}/api/correctiveActions/update/${editableAction}`, 
        { text: editValues.text, logic: editValues.logic }, 
        config
      );
      setEditableAction(null); // Exit editing mode
    } catch (error) {
      if (error.response) {
        console.error('Error saving action:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th></th>
            <th>Text</th>
            <th>Logic</th>
            <th>Last changed</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actions.length === 0 ? 
            <tr>
              <td colSpan={6}>No corrective actions yet.</td>
            </tr>
            :
            actions.map((action, actionIndex) => (
              <tr key={action._id}>
                <td className="form-index">{actionIndex + 1}.</td>
                <td className="form-name">
                  {editableAction === action._id ? (
                    <input 
                      value={editValues.text} 
                      onChange={(e) => handleInputChange('text', e.target.value)} 
                    />
                  ) : (
                    (userRole === 'editor' || userRole === 'admin') ? (
                      <span onClick={() => startEditing(action)}>{action.text}</span>
                    ) : (
                      action.text
                    )
                  )}
                </td>
                <td className="actions-action" align="center">
                  {editableAction === action._id ? (
                    <input 
                      value={editValues.logic} 
                      onChange={(e) => handleInputChange('logic', e.target.value)} 
                    />
                  ) : (
                    (userRole === 'editor' || userRole === 'admin') ? (
                      <span onClick={() => startEditing(action)}>{action.logic}</span>
                    ) : (
                      action.logic
                    )
                  )}
                </td>
                <td className="client-index">{formatDate(action.last_changed)}</td>
                <td className="actions-action" align="center">
                  {(userRole === 'editor' || userRole === 'admin') && (
                    <div className="delete" onClick={() => deleteActionHandler(action._id)}>
                      <img src={trash_icon} className="remove-icon" alt="Delete" />
                    </div>
                  )}
                </td>
                <td className="actions-action" align="center">
                  {editableAction === action._id && (
                    <div className="actions-container">
                      <button id="save_editing" className='action-button' help-title="save changes" 
                        onClick={saveActionChanges}>
                        <img src={save_icon} 
                        alt="Save" 
                        className="size24-icon"/>
                      </button>
                      <button id="cancel_editing"  className='action-button' help-title="cancel changes" 
                        onClick={cancelEditing}>
                        <img src={cancel_icon} 
                        alt="Save" 
                        className="size24-icon"/>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default CorrectiveActionsTable;
