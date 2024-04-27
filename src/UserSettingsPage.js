import { useState } from 'react';
import axios from 'axios';
import { backend_point } from './consts';
import Header from './Header';
import './UserPagesStyle.css'
import user_name_icon from './icons/user-name-icon.svg'
import password_icon from './icons/password-icon.svg'
import arrow_icon from './icons/arrow-right-icon.svg'
import watch_password from './icons/eye-icon.svg'
import hide_password from './icons/eye-off-icon.svg'
import { getAuthToken } from './utils';
import LogoutButton from "./LogoutButton";


const UserSettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [activeSetting, setActiveSetting] = useState('Settings')

  const [hidePassword, setHidePassword] = useState(true)


  const handleChangePassword = async () => {

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `${token}`,
        },
      };

      const data = {
        currentPassword,
        newPassword,
      };

      await axios.post(`${backend_point}/api/users/change-password`, data, config);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      setErrorMessage('Failed to change password. Please try again.');
    }
  };

  return (
    <div className='page-content'>
      <Header />
      <div className='user-settings'>
        {
          activeSetting === 'Settings' ?
          <div className='user-properties-container'>
            <div className='user-properties'>
              <div className='user-properties-block'>
                <div className='user-title-container'>
                  <div className='user-property'>
                    <div className='user-title'>
                      {activeSetting}
                    </div>
                  </div>
                </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                <div className='user-property-container' onClick={() => setActiveSetting('User Name')}>
                  <div className='user-property'>
                    <div className='user-property-icon-container-left'>
                      <figure className='user-property-icon'>
                        <img src={user_name_icon} />
                      </figure>
                    </div>
                    <div className='user-property-title'>
                      Name
                    </div>
                    <div className='user-property-icon-container-right'>
                      <figure className='user-property-icon'>
                        <img src={arrow_icon}/>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                <div className='user-property-container' onClick={() => setActiveSetting('User Password')}>
                  <div className='user-property'>
                    <div className='user-property-icon-container-left'>
                      <figure className='user-property-icon'>
                        <img src={password_icon} />
                      </figure>
                    </div>
                    <div className='user-property-title'>
                      Password
                    </div>
                    <div className='user-property-icon-container-right'>
                      <figure className='user-property-icon'>
                        <img src={arrow_icon}/>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
              <LogoutButton/>
            </div>
          </div>
          :
          activeSetting === 'User Password' ?
          <div className='user-properties-container'>
            <div className='user-properties'>
              <div className='user-properties-block'>
                <div className='user-title-container'>
                  <div className="user-properties-goback-icon" onClick={() => setActiveSetting('Settings')}>
                    <img src={arrow_icon} />
                  </div>
                  <div className='user-property'>
                    <div className='user-title'>
                      {activeSetting}
                    </div>
                  </div>
                </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                <div className='user-property-input-container'>
                  <label htmlFor="currentPassword" className='user-settings__label'>Current password</label>
                  <input
                    type={hidePassword ? "password" : 'text'}
                    id="currentPassword"
                    className='user-settings__input'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <div className='user-property-icon-container-right'>
                    <figure className='user-property-icon' onClick={() => setHidePassword(prev => !prev)}>
                      {hidePassword ? <img src={watch_password}/> : <img src={hide_password}/>}
                    </figure>
                  </div>
                </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                  <div className='user-property-input-container'>
                    <label htmlFor="newPassword" className='user-settings__label'>New password</label>
                    <input
                      type="password"
                      id="newPassword"
                      className='user-settings__input'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
              </div>
              <div className='user-properties-block'>
                <div className='user-property-presentaion-line'></div>
                  <div className='user-property-input-container'>
                    <label htmlFor="confirmPassword" className='user-settings__label'>Confirm new password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className='user-settings__input'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
              </div>
              {errorMessage && <p className='user-settings__error'>{errorMessage}</p>}
              {successMessage && <p className='user-settings__success'>{successMessage}</p>}
              <button className='user-settings__button' onClick={() => handleChangePassword()}>Change Password</button>
            </div>
          </div>
          :
          activeSetting === 'User name' ?
          <></>
          : <></>
        }
      </div>
    </div>
  );
};

export default UserSettingsPage;