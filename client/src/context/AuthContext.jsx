import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../client/src/environment';
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated on app load
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
  try {
    const response = await axios.get(`${baseUrl}/v1/auth/me`, {
      withCredentials: true,
    });

    if (response.data.success) {
      setUser(response.data.data);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  } catch (error) {
    // Suppress only 401 errors from console
    if (error.response?.status === 401) {
      // Expected: do nothing or optionally debug silently
      setUser(null);
      setIsAuthenticated(false);
    } else {
      // Log other unexpected errors to console
      console.error('Auth check failed:', error.response?.data || error.message);
    }
  } finally {
    setLoading(false);
  }
};


    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${baseUrl}/v1/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return { success: true, user: response.data.user };
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${baseUrl}/v1/auth/logout`, {
                withCredentials: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            navigate('/login'); // Redirect to login page after logout
        }
    };


    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};