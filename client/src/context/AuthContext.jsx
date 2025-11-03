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
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Adding token to request:', token.substring(0, 20) + '...');
    } else {
        console.log('⚠️ No token found in localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized - Clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

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
            const storedUser = localStorage.getItem('user');
            
            console.log('🔍 Checking auth...');
            console.log('- Token exists:', !!token);
            console.log('- Stored user exists:', !!storedUser);
            
            if (!token) {
                console.log('❌ No token found, user not authenticated');
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // If we have stored user data, use it immediately for faster UI
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    console.log('✅ Loaded user from localStorage:', parsedUser.email);
                } catch (e) {
                    console.error('Failed to parse stored user:', e);
                }
            }

            // Verify token with backend
            const response = await api.get('/v1/auth/me');
            console.log('✅ Auth verification response:', response.data);

            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(response.data.data));
            } else {
                console.log('❌ Auth verification failed');
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('❌ Auth check error:', error.response?.status, error.message);
            if (error.response?.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);
            
            // Clear any existing auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            const response = await api.post('/v1/auth/login', { 
                email, 
                password 
            });

            console.log('✅ Login response:', response.data);

            if (response.data.success && response.data.token) {
                const { token, user } = response.data;
                
                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                console.log('✅ Token stored:', token.substring(0, 20) + '...');
                console.log('✅ User stored:', user.email);
                
                setUser(user);
                setIsAuthenticated(true);
                
                return { success: true, user };
            } else {
                return {
                    success: false,
                    message: 'Login failed - Invalid response format'
                };
            }
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Logging out...');
            await api.get('/v1/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('✅ Logout complete');
            navigate('/login');
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        api, // Export api instance for use in other components
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};