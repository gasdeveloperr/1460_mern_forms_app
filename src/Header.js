import { useLocation } from 'react-router-dom';
import simmonssafe_logo_login from './icons/simmonssafe-logo-login.png'
import { getUserRole } from './utils';

const Header = () => {

  const userRole = getUserRole()
  const location = useLocation();

  // const isActive = (path) => {
  //   return location.pathname === path;
  // };
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="header-component">
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
                <a href="/clients" className={isActive('/clients') ? 'active' : ''}>
                  Clients
                </a>
              </li>
              <li>
                <a href="/people" className={isActive('/people') ? 'active' : ''}>
                  People
                </a>
              </li>
              <li>
                <a href="/documents" className={isActive('/documents') ? 'active' : ''}>
                  Documents
                </a>
              </li>
              <li>
                <a href="/forms/dashboard" className={isActive('/forms') ? 'active' : ''}>
                  Assessments
                </a>
              </li>
              {/* <li>
                <a href="/forms/results" className={isActive('/forms/results') ? 'active' : ''}>
                  Form Results
                </a>
              </li> */}
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
                Account settings
              </a>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;