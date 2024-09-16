import moment from 'moment';


export const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id
}
export const getUserEmail = () => {
  const email = localStorage.getItem('userEmail');
  return email
}
export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role
}
export const getCurrentOrganization = () => {
  const role = localStorage.getItem('userOrganisation');
  return role
}

export const getAuthToken = () => {
  const role = localStorage.getItem('token');
  return role
}

export const formatDate = (date) => {
  return moment(date).format('HH:mm:ss DD/MM/YYYY'); // Example: 08/02/2023 15:09:35
};