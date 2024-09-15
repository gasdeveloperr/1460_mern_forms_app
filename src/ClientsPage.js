import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import trash_icon from './icons/trash-can-white.svg'
import { backend_point } from './consts';
import { getAuthToken, getUserRole } from './utils';
import ClientsSideMenu from './clients_page_components/ClientsSideMenu';
import ClientsTable from './clients_page_components/ClientsTable';
import FilterSearchBar from './clients_page_components/FilterSearchBar';
import ClientAddingWindow from './clients_page_components/ClientAddingWindow';
import FacilityAddingWindow from './clients_page_components/FacilityAddingWindow';

function ClientsPage() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')

  const [activeOption, setActiveOption] = useState('clients')

  const userRole = getUserRole();


  const [clients, setClients] = useState();
  const [selectedClient, setSelectedClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState();
  const [isAddingWindowOpen, setIsAddingWindowOpen] = useState(false);
  const [isAddingFacilityWindowOpen, setIsAddingFacilityWindowOpen] = useState(false);
  
  const fetchClients = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/clients/all`, config);
      setIsLoading(false);
      setClients(response.data);
      setFilteredClients(response.data)
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching clients, please refresh the page')
        console.error('Error fetching clients:', err);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchClients();
  }, []);

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

  const handleAddingClient = () => {
    setIsAddingWindowOpen(true);
  };

  const handleAddClient = async(newClient) => {

    console.log('handleAddClient : ', newClient)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);

    try {
      const response = await axios.post(`${backend_point}/api/clients/new`, newClient, config);
      setIsLoading(false);
      setClients(response.data);
      setClients([...response.data, newClient]);
      setFilteredClients([...response.data, newClient]);
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching client, please refresh the page')
        console.error('Error fetching client:', err);
      }
    }
  };
  
  const handleAddingFacility = () => {
    setIsAddingFacilityWindowOpen(true);
  };

  const handleAddFacility = async(newFacility) => {
    console.log('handleAddClient update : ', newFacility)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);

    try {
      await axios.put(`${backend_point}/api/clients/addNewLocation/${selectedClient._id}`, newFacility, config);
      setIsLoading(false);
      setSelectedClient(prev => ({...prev, locations: [...prev.locations, newFacility]}));
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching client, please refresh the page')
        console.error('Error fetching client:', err);
      }
    }
  };

  const editClientHandler = async(editedClient) => {
    console.log('editClientHandler update : ', editedClient)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    setIsLoading(true);

    try {
      await axios.put(`${backend_point}/api/clients/update/${selectedClient._id}`, editedClient, config);
      setSelectedClient(editedClient);
      fetchClients();
    } catch (err) {
      if(err.response && err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsError('Error fetching client, please refresh the page')
        console.error('Error fetching client:', err);
      }
    }
  };

  

  const toMainTableHandler = () => {
    setSelectedClient(null)
    fetchClients()
  }

  return (
    <div >
      <Header />
      <div className='page-container'>
        <ClientsSideMenu activeOption={activeOption} 
        handleAddingClient={handleAddingClient} handleAddingFacility={handleAddingFacility}
        selectedClient={selectedClient} />
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
            {
              isLoading ?
                <Spinner/>
              :  
              isError ?
              <div className='error-message' >
                {isError}
              </div>
              :
              <ClientsTable clients={filteredClients} 
              selectedClient={selectedClient} setSelectedClient={setSelectedClient} 
              editClientHandler={editClientHandler} goBack={toMainTableHandler}/>
            }
            <ClientAddingWindow isOpen={isAddingWindowOpen} onClose={() => setIsAddingWindowOpen(false)}
              onAddClient={handleAddClient}/>
            <FacilityAddingWindow isOpen={isAddingFacilityWindowOpen} onClose={() => setIsAddingFacilityWindowOpen(false)}
              onAddFacility={handleAddFacility} selectedClient={selectedClient} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;