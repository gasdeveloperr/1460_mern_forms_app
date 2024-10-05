import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import client_icon from '../icons/client-icon.svg'
import clients_icon from '../icons/clients-icon.svg'
import client_add_icon from '../icons/client-add-icon.svg'
import home_page_icon from '../icons/home-page-icon.svg'
import configuration_icon from '../icons/configuration-icon.svg'
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg'
import files_icon from '../icons/files-icon.svg'
import file_attachment_icon from '../icons/file-attachment-icon.svg'
import data_sheet_icon from '../icons/data-sheet-icon.svg'
import support_icon from '../icons/support-icon.svg'
import '../clients_page_components/ClientsSideMenu.css';




const DocumentsSideMenu = ({ activeOption, handleAddingClient, onItemClick}) => {
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
                <img src={files_icon} className="side-menu-list-header-icon" alt='docs'/>
                  Documents
              </a>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={onItemClick}
              >
                <img src={file_attachment_icon} className="size28-icon" alt='doc'/>
                <span className="menu-item__label">Document Management</span>
              </div>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={onItemClick}
              >
                <img src={data_sheet_icon} className="size26-icon" alt='sheet'/>
                <span className="menu-item__label">Safety Data Sheets </span>
              </div>
              <div
                className={`menu-item ${isActive ? 'menu-item--active' : 'menu-item--inactive'}`}
                onClick={() => handleAddingClient()}
              >
                <img src={file_attachment_icon} className="size28-icon" alt='doc'/>
                <span className="menu-item__label">Instructions For Use </span>
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

export default DocumentsSideMenu;