import LogoutButton from "./LogoutButton";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <div className="logo">
            <a href="/">Forms app</a>
          </div>
          <ul className="nav-links">
            <li><a href="/forms/dashboard">Dashboard</a></li>
            <li><a href="/forms/results">Form Results</a></li>
            <li><a href="/forms/builder/new">Form builder</a></li>
            <li><a href="/administration">Admin panel</a></li>
            <li><a href="/account/settings">User settings</a></li>
            {/* <li><LogoutButton /></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;