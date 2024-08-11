import React, { useState } from 'react';
import '../css_of_components/FilterSearchBar.css';

const FilterSearchBar = ({ onFilterChange, onSearchChange }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    onFilterChange(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="filter-search-bar">
      <div className="filter-dropdown">
        <label htmlFor="status-filter">Filter By:</label>
        <select id="status-filter" value={statusFilter} onChange={handleStatusChange}>
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
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
  );
};

export default FilterSearchBar;