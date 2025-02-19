// utils/AuthService.js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

const AuthService = {
    login: async (email, rollno, password) => {
        try {
            const response = await axios.post('/api/login', {
                email,
                rollNumber: rollno,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('rollNumber', response.data.rollno);
                
                // Dispatch auth change event
                window.dispatchEvent(new Event("authChange"));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp < Date.now() / 1000) {
                AuthService.logout();
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('rollNumber');
        // Dispatch auth change event
        window.dispatchEvent(new Event("authChange"));
    },

    getUserDetails: () => {
        return {
            email: localStorage.getItem('email'),
            rollNumber: localStorage.getItem('rollNumber')
        };
    }
};

export default AuthService;