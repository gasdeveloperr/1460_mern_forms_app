import moment from 'moment';


export const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id
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
  return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Example: 2024-08-20 15:09:35
};