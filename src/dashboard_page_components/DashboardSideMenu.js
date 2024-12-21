import React, { useState } from 'react';
import home_page_icon from '../icons/home-page-icon.svg'
import configuration_icon from '../icons/configuration-icon.svg'
import form_icon from '../icons/form-icon.svg'
import form_groups_icon from '../icons/form-groups-icon.svg'
import add_form_icon from '../icons/add-form-icon.svg'
import add_form_group_icon from '../icons/add-form-group-icon.svg'
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg'
import '../clients_page_components/ClientsSideMenu.css';


const DashboardSideMenu = ({ activeOption, handleAddingForm, handleCreatingFormGroup, changeActiveOptionHandler}) => {

  const [isCollapsed, setIsCollapsed] = useState(false)

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
              <a className='side-menu-list-header'  href="/forms/dashboard">
                <img src={form_icon} className="side-menu-list-header-icon"/>
                  Forms
              </a>
              <div
                className={`menu-item${activeOption === 'forms' ? '-active' : ''}`}
                onClick={() => changeActiveOptionHandler('forms')}
              >
                <img src={form_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Forms </span>
              </div>
              <div className={'menu-item'}
                onClick={() => handleAddingForm()}
              >
                <img src={add_form_icon} className="size26-icon"/>
                <span className="menu-item__label">Create form </span>
              </div>
            </div>
            <div className="side-menu-separator"/>
            <div className="side-menu-list">
              <a className='side-menu-list-header'  href="/forms/dashboard">
                <img src={form_groups_icon} className="side-menu-list-header-icon"/>
                  Form's Groups
              </a>
              <div
                className={`menu-item${activeOption === 'formsGroups' ? '-active' : ''}`}
                onClick={() => changeActiveOptionHandler('formsGroups')}
              >
                <img src={form_groups_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Groups</span>
              </div>
              <div
                className={`menu-item${activeOption === 'addingformsGroup' ? '-active' : ''}`}
                onClick={() => handleCreatingFormGroup()}
              >
                <img src={add_form_group_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Create forms group </span>
              </div>
            </div>
            </>
          }
        </nav>
      </div>
      <div className={`side-menu-backside${isCollapsed ? '-collapsed' : ''}`}/>
    </div>
  );
};

export default DashboardSideMenu;