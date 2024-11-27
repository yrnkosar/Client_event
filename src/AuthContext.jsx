import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);  // New state for role
  const [userPoints, setUserPoints] = useState(null); // New: Add userPoints state
 
  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);  // Decode the token
        setUser(decoded);  // Store the decoded user information
        setRole(decoded.role);  // Set the role from the decoded user info
        console.log('Decoded user:', decoded); // Log the decoded user
        fetchUserPoints(decoded.id, authToken); // Fetch user points at login
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      setUser(null);  // If no authToken, reset user
      setRole(null);  // Reset role as well
      setUserPoints(null); // Reset points   
    }
    console.log('AuthContext user:', user);  // Log user info
    console.log('AuthContext role:', role);  // Log role
    console.log('AuthContext token:', authToken);  // Log authToken
  }, [authToken]); // Run this effect when authToken changes

  const setAuthTokenAndUser = (token) => {
    setAuthToken(token);  // Set the token in state
    localStorage.setItem('authToken', token);  // Save token in localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setRole(decoded.role);
        fetchUserPoints(decoded.id, token); // Fetch user points immediately after login
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }      
  };

  const logout = () => {
    setAuthToken(null);  // Clear the token
    setUser(null);  // Clear the user data
    setRole(null);  // Clear the role
    setUserPoints(null); // Clear points on logout
    localStorage.removeItem('authToken');  // Remove token from localStorage
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
      setUserPoints(totalPoints); // Calculate and set total points
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ authToken, user, role, setAuthToken: setAuthTokenAndUser, userPoints, // Expose userPoints
      setUserPoints,logout, fetchUserPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
