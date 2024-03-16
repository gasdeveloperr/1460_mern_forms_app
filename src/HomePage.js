import Header from './Header';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <h1>Welcome to Our Landing Page</h1>
            <p>
              This is a simple landing page built with React.js. It demonstrates the use of a header component and a main body with content.
            </p>
            <a href="#" className="cta-btn">Get Started</a>
          </div>
        </section>
        <section className="about-section">
          <div className="container">
            <h2 className="section-heading">About Us</h2>
            <p>
              We are a team of passionate developers dedicated to creating outstanding web applications. Our mission is to provide high-quality solutions that meet our clients' needs and exceed their expectations.
            </p>
          </div>
        </section>
        <section className="services-section">
          <div className="container">
            <h2 className="section-heading">Our Services</h2>
            <ul>
              <li>Web Development</li>
              <li>Mobile App Development</li>
              <li>UI/UX Design</li>
              <li>Consulting</li>
            </ul>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          &copy; 2023 My Landing Page
        </div>
      </footer>
    </div>
  );
};

export default HomePage;