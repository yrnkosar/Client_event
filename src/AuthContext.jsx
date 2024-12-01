import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [userPoints, setUserPoints] = useState(null); 
 
  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken); 
        setUser(decoded);  
        setRole(decoded.role);  
        console.log('Decoded user:', decoded);
        fetchUserPoints(decoded.id, authToken); 
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      setUser(null);  
      setRole(null);  
      setUserPoints(null); 
    }
    console.log('AuthContext user:', user);  
    console.log('AuthContext role:', role);  
    console.log('AuthContext token:', authToken);  
  }, [authToken]); 

  const setAuthTokenAndUser = (token) => {
    setAuthToken(token);  
    localStorage.setItem('authToken', token);  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setRole(decoded.role);
        fetchUserPoints(decoded.id, token); 
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }      
  };

  const logout = () => {
    setAuthToken(null);  
    setUser(null);  
    setRole(null);  
    setUserPoints(null); 
    localStorage.removeItem('authToken');  
  };
  
  const fetchUserPoints = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/point/user-points`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user points.');
      }
      const data = await response.json();
      const totalPoints = data.points.reduce((sum, pointEntry) => sum + pointEntry.points, 0);
      setUserPoints(totalPoints); 
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ authToken, user, role, setAuthToken: setAuthTokenAndUser, userPoints, 
      setUserPoints,logout, fetchUserPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
