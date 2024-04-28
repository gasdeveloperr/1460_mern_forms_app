import { useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';
import { backend_point } from './consts';
import { useNavigate, useParams } from 'react-router-dom';

const ActivatePage = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const  [isLoading, setIsLoading] = useState(false)

  const [isActivated, setIsActivated] = useState(false)

  useEffect(() => {

    const activateUser = async () => {
      try {
        const response = await axios.post(`${backend_point}/api/activate/${token}`);
        if(response.status){
          setIsActivated(true)
          navigate('/login');
        }


      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };

    setIsLoading(true);
    activateUser();
  }, []);

  return (
    <div className="form-live-page">
      {
        isLoading ?
          <Spinner/>
        :  
        <></>
      }
    </div>
  );
};

export default ActivatePage;