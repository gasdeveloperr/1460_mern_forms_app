import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
};

export default NotFoundPage;