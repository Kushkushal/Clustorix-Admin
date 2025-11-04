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
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for automatic logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized - Clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
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
            
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // Load user from localStorage immediately for instant UI
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    console.log('✅ User loaded from cache:', parsedUser.email);
                } catch (e) {
                    console.error('Failed to parse stored user:', e);
                }
            }

            // Verify token with backend in background
            try {
                const response = await api.get('/v1/auth/me');
                
                if (response.data.success) {
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                    // Update cache with fresh data
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    console.log('✅ Token verified with server');
                } else {
                    throw new Error('Invalid auth response');
                }
            } catch (error) {
                console.error('❌ Token verification failed:', error.message);
                // Token invalid, clear everything
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('❌ Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);
            
            // Clear any existing auth data first
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            const response = await api.post('/v1/auth/login', { 
                email, 
                password 
            });

            console.log('Login response:', response.data);

            if (response.data.success && response.data.token) {
                const { token, user } = response.data;
                
                // Store authentication data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                console.log('✅ Token stored successfully');
                console.log('✅ User:', user.email, '| Role:', user.role);
                
                // Update state
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
            // Always clear local state regardless of API response
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('✅ Logout complete, redirecting to login');
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
        api, // Export for use in other components
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};