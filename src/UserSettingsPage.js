import { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_point } from './consts';
import Header from './Header';
import './UserPagesStyle.css'
import user_name_icon from './icons/user-name-icon.svg'
import password_icon from './icons/password-icon.svg'
import arrow_icon from './icons/arrow-right-icon.svg'
import watch_password from './icons/eye-icon.svg'
import hide_password from './icons/eye-off-icon.svg'
import { getAuthToken, getUserId } from './utils';
import LogoutButton from "./LogoutButton";
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';


const UserSettingsPage = () => {
  const navigate = useNavigate();
  const  [isLoading, setIsLoading] = useState(false)
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
  
  const [currentName, setCurrentName] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  })
  const [theme, setTheme] = useState('');


  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
        ...prev,
        [type]: !prev[type]
      }
    ));
  };

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
        setCurrentName(userData.name);
        if(userData.notifications){
          setNotifications(userData.notifications)
        }
        if(userData.theme){
          setTheme(userData.theme)
        }
        setIsLoading(false);

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

    setIsLoading(true);
    getUser();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `${token}`,
        },
      };

      const data = {
        id: userId,
        newName: currentName,
        newNotifications: notifications,
        newTheme: theme,
      };
      const response=  await axios.post(`${backend_point}/api/users/change-settings`, data, config);
      const updatedUser = response.data;

      toast.success('Settings saved successfully!');
      setIsLoading(false);
      setCurrentName(updatedUser.name);
      setNotifications(updatedUser.notifications);
      setTheme(updatedUser.theme);
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

  return (
    <div className='page-content'>
      <Header />
      {isLoading ? 
        <Spinner/>
      :
      <div className="settings-container">
      <h1 className="settings-title">Personal Settings</h1>
      <form onSubmit={handleSaveSettings} className="settings-form">
        <div className="form-section">
          <h2 className="section-title">Profile Information</h2>
          <div className="form-group">
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-section">
          <h2 className="section-title">Notifications</h2>
          <div className="notification-options">
            <label className="notification-option">
              <input
                type="checkbox"
                checked={notifications?.email}
                onChange={() => handleNotificationChange('email')}
                className="checkbox-input"
              />
              <span className="checkbox-label">Email Notifications</span>
            </label>
            <label className="notification-option">
              <input
                type="checkbox"
                checked={notifications?.push}
                onChange={() => handleNotificationChange('push')}
                className="checkbox-input"
              />
              <span className="checkbox-label">Push Notifications</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Appearance</h2>
          <div className="theme-selector">
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.value)}
                className="radio-input"
              />
              <span className="radio-label">Light Theme</span>
            </label>
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.value)}
                className="radio-input"
              />
              <span className="radio-label">Dark Theme</span>
            </label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
        <LogoutButton/>
      </form>
    </div>
      // <div className='user-settings'>
      //     activeSetting === 'User password' ?
      //     <div className='user-properties-container'>
      //       <div className='user-properties'>
      //         <div className='user-properties-block'>
      //           <div className='user-title-container'>
      //             <div className="user-properties-goback-icon" onClick={() => setActiveSetting('Settings')}>
      //               <img src={arrow_icon} />
      //             </div>
      //             <div className='user-property'>
      //               <div className='user-title'>
      //                 {activeSetting}
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div className='user-properties-block'>
      //           <div className='user-property-presentaion-line'></div>
      //             <div className='user-property-input-container'>
      //               <label htmlFor="newPasswordInput" className='user-settings__label'>New password</label>
      //               <input
      //                 type={hideNewPassword ? "password" : "text"}
      //                 id="newPasswordInput"
      //                 className='user-settings__input'
      //                 value={newPassword}
      //                 onChange={(e) => setNewPassword(e.target.value)}
      //                 autoComplete="off"
      //                 required
      //               />
      //               <div className='user-property-icon-container-right'>
      //                 <figure className='user-property-icon' onClick={() => setHideNewPassword(prev => !prev)}>
      //                   {hideNewPassword ? <img src={watch_password}/> : <img src={hide_password}/>}
      //                 </figure>
      //               </div>
      //             </div>
      //         </div>
      //         <div className='user-properties-block'>
      //           <div className='user-property-presentaion-line'></div>
      //             <div className='user-property-input-container'>
      //               <label htmlFor="confirmPasswordInput" className='user-settings__label'>Confirm new password</label>
      //               <input
      //                 type={hideConfirmPassword ? "password" : "text"}
      //                 id="confirmPasswordInput"
      //                 className='user-settings__input'
      //                 value={confirmPassword}
      //                 onChange={(e) => setConfirmPassword(e.target.value)}
      //                 autoComplete="off"
      //                 required
      //               />
      //               <div className='user-property-icon-container-right'>
      //                 <figure className='user-property-icon' onClick={() => setHideConfirmPassword(prev => !prev)}>
      //                   {hideConfirmPassword ? <img src={watch_password}/> : <img src={hide_password}/>}
      //                 </figure>
      //               </div>
      //             </div>
      //         </div>
      //         <div className='user-requirements-block'>
      //           <div className='user-property-presentaion-line'></div>
      //           <div className='user-requirements-container'>
      //             <p>Password Requirements:</p>
      //             <ul>
      //               <li>Must be at least 8 characters long.</li>
      //               <li>Must contain at least one letter.</li>
      //               <li>Must contain at least one number.</li>
      //               <li>Must not contain any spaces.</li>
      //             </ul>
      //           </div>
      //           <div className='user-property-presentaion-line'></div>
      //         </div>
      //         <button className='user-settings__button' onClick={() => handleChangePassword()}>Change Password</button>
      //       </div>
      //     </div>
      // </div>
    }
    </div>
  );
};

export default UserSettingsPage;


  // const handleChangePassword = async () => {
  //   if (newPassword !== confirmPassword) {
  //     toast.error('New password and confirm password do not match.');
  //     return;
  //   }
  //   if (newPassword.length < 8) {
  //     toast.error('Password must be at least 8 characters long.');
  //     return;
  //   }
  //   // Check if password contains at least one letter
  //   if (!/[a-zA-Z]/.test(newPassword)) {
  //     toast.error('Password must contain at least one letter.');
  //     return;
  //   }
  //   // Check if password contains at least one number
  //   if (!/\d/.test(newPassword)) {
  //     toast.error('Password must contain at least one number.');
  //     return;
  //   }
  //   // Check if password contains any spaces
  //   if (/\s/.test(newPassword)) {
  //     toast.error('Password must not contain any spaces.');
  //     return;
  //   }
  //   try {
  //     const token = getAuthToken();
  //     const config = {
  //       headers: {
  //         'Authorization': `${token}`,
  //       },
  //     };
  //     const data = {
  //       id: userId,
  //       password: newPassword,
  //     };
  //     await axios.post(`${backend_point}/api/users/change-password`, data, config);
  //     setNewPassword('');
  //     setConfirmPassword('');
  //     toast.success('Password changed successfully!');
  //   } catch (err) {
  //     if(err.response && err.response.status === 401){
  //       localStorage.removeItem('token');
  //       navigate('/login');
  //     }else{
  //       toast.error('Error fetching user, please refresh the page.');
  //       console.error('Error fetching user:', err);
  //     }
  //   }
  // };