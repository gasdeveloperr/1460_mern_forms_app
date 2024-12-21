import React, { useState } from 'react';
import client_add_icon from '../icons/client-add-icon.svg'
import home_page_icon from '../icons/home-page-icon.svg'
import add_icon from '../icons/plus-white-icon.svg'
import form_icon from '../icons/form-icon.svg'
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg'
import '../clients_page_components/ClientsSideMenu.css';


const CorrectiveActionsSideMenu = ({createActionHandler}) => {

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
              {/* <a className='side-menu-list-header'  href="/corrective_actions">
                <img src={form_icon} className="side-menu-list-header-icon"/>
                  Corrective Actions
              </a> */}
              <div className='menu-item-active'>
                <img src={form_icon} className="menu-item-icon"/>
                <span className="menu-item__label">Corrective actions </span>
              </div>
              <div className={'menu-item'}
                onClick={() => createActionHandler()}
              >
                <img src={add_icon} className="size22-icon"/>
                <span className="menu-item__label">Create corrective action </span>
              </div>
            </div>
            <div className="side-menu-separator"/>
            </>
          }
        </nav>
      </div>
      <div className={`side-menu-backside${isCollapsed ? '-collapsed' : ''}`}/>
    </div>
  );
};

export default CorrectiveActionsSideMenu;