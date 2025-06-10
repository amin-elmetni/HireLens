export const useAuthUser = () => {
  const userJson = localStorage.getItem('auth_user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};
