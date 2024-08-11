import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import client_icon from '../icons/client-icon.svg'
import clients_icon from '../icons/clients-icon.svg'
import client_add_icon from '../icons/client-add-icon.svg'
import home_page_icon from '../icons/home-page-icon.svg'
import configuration_icon from '../icons/configuration-icon.svg'
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg'
import position_case_icon from '../icons/positions-case-icon.svg'
import support_icon from '../icons/support-icon.svg'
import data_sheet_icon from '../icons/data-sheet-icon.svg'
import '../clients_page_components/ClientsSideMenu.css';




const PeopleSideMenu = ({ activeOption, handleAddingClient, onItemClick}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="side-menu-component">
        <div className={`side-menu-container${isCollapsed ? '-collapsed' : ''}`}>
        <nav className="side-menu-nav">
          <div className="side-menu-collapse-button" onClick={() => setIsCollapsed(prev => !prev)}>
            <img src={arrow_menu_icon} style={{transform: isCollapsed ? 'rotate(180deg)' : ''}}/>
          </div>
          {
            isCollapsed ? 
              <></>
            :
            <>
            <div className="side-menu-list">
              <a className='side-menu-list-header' href="/">
                <img src={home_page_icon} className="side-menu-list-header-icon"/>
                Home
              </a>
            </div>
            <div className="side-menu-separator"/>
            <div className="side-menu-list">
              <a className='side-menu-list-header'  href="/clients">
                <img src={client_icon} className="side-menu-list-header-icon"/>
                  People
              </a>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={onItemClick}
              >
                <img src={clients_icon} className="menu-item-icon"/>
                <span className="menu-item__label">People </span>
              </div>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={() => handleAddingClient()}
              >
                <img src={client_add_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Add user </span>
              </div>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={() => handleAddingClient()}
              >
                <img src={client_add_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Batch import </span>
              </div>
              
            </div>
            <div className="side-menu-separator"/>
            <div className="side-menu-list">
              <a className='side-menu-list-header'  href="/configuration">
                <img src={configuration_icon} className="side-menu-list-header-icon"/>
                Credentials
              </a>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={onItemClick}
              >
                <img src={position_case_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Compliance report </span>
              </div>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={onItemClick}
              >
                <img src={data_sheet_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Reimbursement Report </span>
              </div>
            </div>
            <div className="side-menu-separator"/>
            <div className="side-menu-list">
              <a className='side-menu-list-header'  href="/configuration">
                <img src={support_icon} className="side-menu-list-header-icon"/>
                Support
              </a>
            </div>
            </>
          }
          
        </nav>
      </div>
      <div className={`side-menu-backside${isCollapsed ? '-collapsed' : ''}`}/>
    </div>
  );
};

export default PeopleSideMenu;