export const getToken = () => localStorage.getItem('token');

export const decodeToken = (token) => {
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
};
