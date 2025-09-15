import React, { createContext, useState, useEffect } from 'react';
import API, { setAuthToken } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // minimal user info: role, tenantId (decoded from token optionally)

  useEffect(()=>{
    if(token){
      localStorage.setItem('token', token);
      setAuthToken(token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ role: payload.role, tenantId: payload.tenantId });
      } catch(e){
        setUser(null);
      }
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
    }
  }, [token]);

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
