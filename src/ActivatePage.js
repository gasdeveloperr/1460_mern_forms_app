import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';
import { backend_point } from './consts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import watch_password from './icons/eye-icon.svg'
import hide_password from './icons/eye-off-icon.svg'

const ActivatePage = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hideNewPassword, setHideNewPassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [isActivated, setIsActivated] = useState(false)

  const checkActivationHandler = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${backend_point}/api/activate/${token}`);
      if (response.status === 200) {
        setIsLoading(false);
        setIsActivated(true);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() =>{
    checkActivationHandler()
  }, [])

  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
  
    // Check if password contains at least one letter
    if (!/[a-zA-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one letter.');
      return;
    }
  
    // Check if password contains at least one number
    if (!/\d/.test(newPassword)) {
      toast.error('Password must contain at least one number.');
      return;
    }
  
    // Check if password contains any spaces
    if (/\s/.test(newPassword)) {
      toast.error('Password must not contain any spaces.');
      return;
    }

    try {
      setIsLoading(true);

      const data = {
        token: token,
        password: newPassword,
      };

      const response = await axios.post(`${backend_point}/api/activate/${token}`, data);
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');
      setIsLoading(false);
      setIsActivated(true);
    } catch (err) {
      if(err.response.status === 401){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        toast.error('Error activating user, please refresh the page.');
        console.error('Error activating user:', err);
      }
    }
  };

  // useEffect(()=>{
  //   if(isActivated){
  //     navigate('/login')
  //   }else{
  //     navigate('/error')
  //   }
  // },[isActivated])

  return (
    <div className="activate-page">
      {
        isLoading  ?
          <Spinner/>
        :  
        !isActivated ?
        <div className='activate-page-container'>
            <div className='user-properties'>
              <div className='user-properties-block'>
                <div className='user-title-container'>
                  <div className='user-property'>
                    <div className='user-title'>
                      Set your password
                    </div>
                  </div>
                </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                  <div className='activate-page-input-container'>
                    <label htmlFor="newPasswordInput" className='user-settings__label'>New password</label>
                    <input
                      type={hideNewPassword ? "password" : "text"}
                      id="newPasswordInput"
                      className='user-settings__input'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <div className='user-property-icon-container-right'>
                      <figure className='user-property-icon' onClick={() => setHideNewPassword(prev => !prev)}>
                        {hideNewPassword ? <img src={watch_password}/> : <img src={hide_password}/>}
                      </figure>
                    </div>
                  </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                  <div className='activate-page-input-container'>
                    <label htmlFor="confirmPasswordInput" className='user-settings__label'>Confirm new password</label>
                    <input
                      type={hideConfirmPassword ? "password" : "text"}
                      id="confirmPasswordInput"
                      className='user-settings__input'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <div className='user-property-icon-container-right'>
                      <figure className='user-property-icon' onClick={() => setHideConfirmPassword(prev => !prev)}>
                        {hideConfirmPassword ? <img src={watch_password}/> : <img src={hide_password}/>}
                      </figure>
                    </div>
                  </div>
              </div>
              <div className='user-requirements-block'>
                <div className='user-property-presentaion-line'></div>
                <div className='activate-page-requirements-container'>
                  <p>Password Requirements:</p>
                  <ul>
                    <li>Must be at least 8 characters long.</li>
                    <li>Must contain at least one letter.</li>
                    <li>Must contain at least one number.</li>
                    <li>Must not contain any spaces.</li>
                  </ul>
                </div>
                <div className='user-property-presentaion-line'></div>
              </div>
              <button className='user-settings__button' onClick={() => handleChangePassword()}>Set Password</button>
            </div>
          </div>
        :
        isActivated ?
        <div className="activated-success-block">
          <p>User successfully activated!</p>
          <p>Now you can go to the login page.</p>
          <Link className="login-button" to="/login">Login</Link>
        </div>
        :
        <></>
      }
    </div>
  );
};

export default ActivatePage;