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

// Create axios instance with default config
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', token.substring(0, 20) + '...');
    } else {
        console.log('No token found in localStorage');
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Checking auth, token exists:', !!token);
            
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const response = await api.get('/v1/auth/me');
            console.log('Auth check response:', response.data);

            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.log('Auth check error:', error.response?.status, error.message);
            if (error.response?.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } else {
                console.error('Auth check failed:', error.response?.data || error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            const response = await api.post('/v1/auth/login', { 
                email, 
                password 
            });

            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                setUser(response.data.user);
                setIsAuthenticated(true);
                
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
            await api.get('/v1/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
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