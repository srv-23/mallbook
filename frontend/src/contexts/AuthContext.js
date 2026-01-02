import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user - useCallback to prevent infinite loop
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'LOADING' });
      setAuthToken(token);
      try {
        const res = await axios.get('/api/auth/user');
        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (error) {
        console.error('Auth error:', error);
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      
      // Set the token in localStorage and axios headers
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // Dispatch success action
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL' });
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          'Login failed';
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token, user } = res.data;
      
      // Set the token in localStorage and axios headers
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // Dispatch success action
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL' });
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          'Registration failed';
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      dispatch({ type: 'USER_LOADED', payload: res.data.user });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        register,
        logout,
        updateProfile,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 