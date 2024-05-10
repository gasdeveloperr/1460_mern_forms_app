import { useLocation } from 'react-router-dom';
import simmonssafe_logo_login from './icons/simmonssafe-logo-login.png'
import { getUserRole } from './utils';

const Header = () => {

  const userRole = getUserRole()
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
      <nav className="header-nav">
        <div className="logo">
          <a href="/">
            <img src={simmonssafe_logo_login} alt="" />
          </a>
        </div>
        <ul className="nav-links">
          <li>
            <a href="/forms/dashboard" className={isActive('/forms/dashboard') ? 'active' : ''}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="/forms/results" className={isActive('/forms/results') ? 'active' : ''}>
              Form Results
            </a>
          </li>
          {(userRole === 'admin' || userRole === 'editor') && (
            <li>
              <a href="/administration" className={isActive('/administration') ? 'active' : ''}>
                Admin panel
              </a>
            </li>
          )}
        </ul>
        <div className="header-button">
          <a href="/account/settings" className={isActive('/account/settings') ? 'active' : ''}>
            User settings
          </a>
        </div>
      </nav>
    </div>
    </header>
  );
};

export default Header;