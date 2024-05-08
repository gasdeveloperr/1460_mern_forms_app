import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useEffect } from 'react';
import { getAuthToken, getUserId } from './utils';
import axios from 'axios';
import { backend_point } from './consts';
import { toast } from 'react-toastify';

const HomePage = () => {

  const navigate = useNavigate();
  const userId = getUserId();

  useEffect(() => {

    const token = getAuthToken();

    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    const getUser = async () => {
      try {
        const response = await axios.get(`${backend_point}/api/users/${userId}`, config);
        const userData = response.data;

      } catch (err) {
        if(err.response.status === 401){
          localStorage.removeItem('token');
          navigate('/login');
        }else{
          toast.error('Error fetching user, please refresh the page.');
          console.error('Error fetching user:', err);
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className='home-page-container'>
      <Header />
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <h1 className="main-heading">Welcome to Form Builder!</h1>
            <p className="hero-text">
              This powerful application allows you to create custom forms tailored to your specific needs. Whether you need to collect data, gather feedback, or conduct surveys, Form Builder has got you covered.
            </p>
            <p className="hero-text">
              Getting started is easy! Navigate to the Dashboard to view all the forms you've created. From there, you can create a new form by clicking the "New Form" button. 
            </p>
            <p className="hero-text">
              The intuitive form builder interface enables you to add various field types, such as text inputs, dropdowns, checkboxes, and more. Customize the form fields, rearrange their order, and even set validation rules to ensure accurate data collection.
            </p>
            <a href="/forms/dashboard" className="cta-btn">Go to the dashboard</a>
          </div>
        </section>
    
        <section className="about-section">
          <div className="container">
            <h2 className="section-heading">Using forms</h2>
            <p className="about-text">
              Once you've designed your form, you can preview it and make any necessary adjustments before publishing. To share your form with others or embed it on a website, simply click the "Live Form" button on the form card in the Dashboard. This will generate a unique URL that you can share or embed, allowing others to access and fill out your form.
            </p>
          </div>
        </section>
    
        {/* <section className="about-section">
          <div className="container">
            <h2 className="section-heading">Future plans</h2>
            <p className="about-text">
              In the future, we plan to introduce user management features, enabling you to grant access and permissions to team members or collaborators. Additionally, we'll implement form result tracking, providing you with comprehensive analytics and insights into the data collected through your forms. This will allow you to make data-driven decisions and gain valuable insights from your form submissions.
            </p>
          </div>
        </section> */}
      </main>
    
      <footer className="footer">
          &copy; 2024 Form Builder
      </footer>
    </div>
  );
};

export default HomePage;