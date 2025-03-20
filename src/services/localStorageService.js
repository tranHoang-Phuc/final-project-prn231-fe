export const KEY_TOKEN = "accessToken";
export const KEY_USER = "user";
export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const setUser = (user) => {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem(KEY_USER));
}

export const removeUser = () => {
  return localStorage.removeItem(KEY_USER);
}

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};
