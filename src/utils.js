export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role
}

export const getAuthToken = () => {
  const role = localStorage.getItem('token');
  return role
}