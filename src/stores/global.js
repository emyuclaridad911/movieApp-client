import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useGlobalStore = defineStore('global', () => {

  const user = reactive({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
    isAdmin: localStorage.getItem('isAdmin') === 'true' || false,
  });

  function setUserSession({ token, email, isAdmin }) {
    user.token = token;
    user.email = email;
    user.isAdmin = isAdmin;

    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('isAdmin', isAdmin);
  }

  function clearUserSession() {
    user.token = null;
    user.email = null;
    user.isAdmin = false;

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
  }

  return {
    user,
    setUserSession,
    clearUserSession,
  };
});
