export const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id
}
export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role
}

export const getAuthToken = () => {
  const role = localStorage.getItem('token');
  return role
}