import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getUserRole } from './utils';
import ClientsSideMenu from './clients_page_components/ClientsSideMenu';
import ClientsTable from './clients_page_components/ClientsTable';
import FilterSearchBar from './clients_page_components/FilterSearchBar';

function ClientsPage() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [activeOption, setActiveOption] = useState('clients')

  const userRole = getUserRole();


  const initialClients = [
    {
      name: "Simmons Safe",
      status: "active",
      locations: [
        {
          facility: "Connecticut Locations",
          address: "404 Siena Lane, Glen Allen, VA, USA, 23059",
          primary_contact: "Angela Simmons",
          phone: "910-322-5282",
          contact_email: "angela@simmonssafe.com"
        },
        {
          facility: "Massachusetts Locations",
          address: "123 Main St, Boston, MA, USA, 02108",
          primary_contact: "John Doe",
          phone: "617-555-1234",
          contact_email: "john@simmonssafe.com"
        }
      ]
    },
    {
      name: "ABC Dental Center",
      status: "pending",
      locations: [
        {
          facility: "Main Office",
          address: "789 Maple Street, Springfield, IL, USA, 62701",
          primary_contact: "Dr. John Smith",
          phone: "217-555-1234",
          contact_email: "jsmith@abcdental.com"
        },
        {
          facility: "Branch Office",
          address: "456 Oak Ave, Chicago, IL, USA, 60601",
          primary_contact: "Dr. Jane Doe",
          phone: "312-555-5678",
          contact_email: "jdoe@abcdental.com"
        }
      ]
    }
  ];
  const [clients, setClients] = useState(initialClients);
  const [filteredClients, setFilteredClients] = useState(initialClients);

  const handleFilterChange = (status) => {
    if (status === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => client.status === status);
      setFilteredClients(filtered);
    }
  };

  const handleSearchChange = (searchTerm) => {
    const searched = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.locations.some(location =>
        location.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.primary_contact.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredClients(searched);
  };

  return (
    <div >
      <Header />
      <div className='page-container'>
        <ClientsSideMenu activeOption={activeOption}/>
        <div className="table-page-body">
          <div className="table-page-heading">
            <div className="dashboard-page-title">
              Clients
            </div>
            <FilterSearchBar
              onFilterChange={handleFilterChange} 
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="table-page-content">
            <ClientsTable clients={filteredClients}/>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;