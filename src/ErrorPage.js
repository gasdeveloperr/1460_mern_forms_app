import { useParams } from 'react-router-dom';

const ErrorPage = () => {

  const { token } = useParams();
  
  return (
    <div className="error-page">
      <div className="error-page-content">
        Something goes wrong, sorry
      </div>
    </div>
  );
};

export default ErrorPage;