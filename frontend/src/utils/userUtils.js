const USER_KEY = 'auth_user';

export const saveUser = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
