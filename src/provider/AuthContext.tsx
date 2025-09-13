// AuthContext.tsx
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  userInfo: any;
  login: (userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userInfo: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem('userInfo') || 'null');
  });

  const login = (userData: any) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userInfo', JSON.stringify(userData.data));
    setIsLoggedIn(true);
    setUserInfo(userData.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);