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
        if(err.response && err.response.status === 401){
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
            <h1 className="main-heading">Welcome to the Form Builder!</h1>
            <p className="hero-text">
              This powerful application allows you to create custom forms tailored to your specific needs. Whether you need to collect data, gather feedback, or conduct surveys, Form Builder has got you covered.
            </p>
            <p className="hero-text">
              Getting started is easy! Navigate to the Assessments Page to view all the forms you've created. From there, you can create a new form by clicking the "Create form" button on the side menu. 
            </p>
            <p className="hero-text">
              The intuitive form builder interface enables you to add various field types, such as text inputs, dropdowns, checkboxes, and more. Customize the form fields, rearrange their order, and even set validation rules to ensure accurate data collection.
            </p>
            <a href="/forms/dashboard" className="cta-btn">Go to the Assessments Page</a>
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
        <section className="about-section">
          <div className="container">
            <h2 className="section-heading">Scoring and Viewing Results</h2>
            <p className="about-text">
              After your form has been filled out, you can easily access and analyze the results. For scored forms, the system automatically calculates scores based on predefined criteria, providing instant feedback. Each submission is stored and can be reviewed in detail, allowing you to assess individual responses or get an overview of all submissions. To view the results, simply navigate to the "Form Results" page from your dashboard. This feature offers insights through data visualization, making it easier to track performance or trends over time.
            </p>
          </div>
        </section>
      </main>
    
      <footer className="footer">
          &copy; 2024 Form Builder
      </footer>
    </div>
  );
};

export default HomePage;