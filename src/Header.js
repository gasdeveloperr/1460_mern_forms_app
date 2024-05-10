import simmonssafe_logo_login from './icons/simmonssafe-logo-login.png'
import { getUserRole } from './utils';

const Header = () => {

  const userRole = getUserRole()

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
            <li><a href="/forms/dashboard">Dashboard</a></li>
            <li><a href="/forms/results">Form Results</a></li>
            {
              (userRole === 'admin' || userRole ==='editor') && 
              <li><a href="/administration">Admin panel</a></li>
            }
          </ul>
          <div className="header-button">
            <a href="/account/settings">User settings</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;