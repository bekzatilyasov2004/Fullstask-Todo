import { create } from 'zustand';

const useUserStore = create((set) => ({
  name: '',
  email: '',
  token: '',
  
  
  setUser: (userData) => {
    set({
      name: userData.name,
      email: userData.email,
      token: userData.token,
    });
    localStorage.setItem('user', JSON.stringify(userData));
  },

  clearUser: () => {
    set({ name: '', email: '', token: '' });

    localStorage.removeItem('user');
  },

  getUserFromLocalStorage: () => {
    const user = localStorage.getItem('user');
    
    if (user) {
      const parsedUser = JSON.parse(user);
      
      set({
        name: parsedUser.name,
        email: parsedUser.email,
        token: parsedUser.token,
      });
    }
  }
}));

export default useUserStore;
