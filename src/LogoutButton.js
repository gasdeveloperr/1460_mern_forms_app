import { useNavigate } from "react-router-dom";
import './Login.css';

const LogoutButton = () => {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <button className="logout-button" onClick={() => handleLogout()}>
      Logout
    </button>
  );
};

export default LogoutButton;