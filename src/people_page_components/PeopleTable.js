import React, { useEffect } from 'react';
import '../clients_page_components/ClientsTable.css';

const PeopleTable = ({ users, setChosenUser }) => {

  
  useEffect(() => {
    console.log('PeopleTable ',users)
  }, [users]);
  return (
    <div className="clients-table-container">
      {
        users &&
        <table className="clients-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Work Email/Username</th>
              <th>Department</th>
              <th>Position</th>
              <th>Work Functions</th>
              <th>Role</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, userIndex) => (
              <tr key={`${user.name}-${userIndex}`}>
                <td>{userIndex+1}.</td>
                <td className="user-name" onClick={() => setChosenUser(user)} style={{ cursor: 'pointer' }}>
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.business}</td>
                <td>{user.position && user.position.toUpperCase().substring(0, 1)+user.position.slice(1)}</td>
                <td>{user.work_functions}</td>
                <td>{user.role && user.role.toUpperCase().substring(0, 1)+user.role.slice(1)}</td>
                <td>{user.status && user.status.toUpperCase().substring(0, 1)+user.status.slice(1)}</td>
                <td>{user.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

      }
    </div>
  );
};

export default PeopleTable;