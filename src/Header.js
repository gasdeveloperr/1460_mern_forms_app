
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <div className="logo">
            <a href="#">My Landing Page</a>
          </div>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/forms/dashboard">Dashboard</a></li>
            <li><a href="/forms/results">Form Results</a></li>
            <li><a href="/forms/builder/new">Form builder</a></li>
            {/* <li><a href="/forms/builder">Form using</a></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;