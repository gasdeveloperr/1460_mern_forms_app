import React, { useState, useEffect } from 'react';
import '../css_of_components/FilterSearchBar.css';
import cancel_icon from '.././icons/cancel-icon.svg';

const FilterSearchBar = ({ onFilterChange, onSearchChange }) => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    position: '',
    workFunctions: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleClearAllFilters = () => {
    setFilters({
      role: '',
      status: '',
      position: '',
      workFunctions: '',
    });
    onFilterChange({
      role: '',
      status: '',
      position: '',
      workFunctions: '',
    });
  };

  const handleClearFilter = (filterType) => {
    handleFilterChange(filterType, '');
  };

  return (
    <div className="filter-search-bar-container">
      <div className="filter-search-bar">
        <div className="filter-dropdown">
          <label htmlFor="role-filter">Filter By:</label>
          <select
            id="role-filter"
            value={'default'}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="default">Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Editor">Editor</option>
            <option value="Contributor">Contributor</option>
            <option value="User">User</option>
          </select>
          <select
            id="status-filter"
            value={'default'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="default">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select
            id="position-filter"
            value={'default'}
            onChange={(e) => handleFilterChange('position', e.target.value)}
          >
            <option value="default">Position</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
            <option value="Analyst">Analyst</option>
          </select>
        </div>
        <div className="search-input">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sort-dropdown">
          <select>
            <option value="name">by Name</option>
            <option value="status">by Status</option>
          </select>
        </div>
      </div>
      {(filters.role || filters.status || filters.position) && (
        <div className="filter-search-bar-filters">
          <div className="clear-filters-button" onClick={handleClearAllFilters}>
            Clear all filters
          </div>
          {filters.role && (
            <div className="filter-item">
              Role: {filters.role}
              <div className="filter-item-img" onClick={() => handleClearFilter('role')}>
                <img src={cancel_icon} alt="Cancel" />
              </div>
            </div>
          )}
          {filters.status && (
            <div className="filter-item">
              Status: {filters.status}
              <div className="filter-item-img" onClick={() => handleClearFilter('status')}>
                <img src={cancel_icon} alt="Cancel" />
              </div>
            </div>
          )}
          {filters.position && (
            <div className="filter-item">
              Position: {filters.position}
              <div className="filter-item-img" onClick={() => handleClearFilter('position')}>
                <img src={cancel_icon} alt="Cancel" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSearchBar;
