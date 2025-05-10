import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check overall form validity
        const checkValidity = () => {
            let valid = true;
            
            if (!isLogin) {
                if (!formData.first_name.trim()) valid = false;
                if (!formData.last_name.trim()) valid = false;
            }
            
            if (!formData.email.trim() || !validateEmail(formData.email)) valid = false;
            if (!formData.password || formData.password.length < 6) valid = false;
            
            setIsValid(valid);
        };
        
        checkValidity();
    }, [formData, isLogin]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'first_name':
            case 'last_name':
                if (!value.trim()) error = 'This field is required';
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!validateEmail(value)) {
                    error = 'Please enter a valid email';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            default:
                break;
        }
        
        return error;
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate the field when it loses focus
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleAuthToggle = () => {
        setIsLogin(!isLogin);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        });
        setErrors({
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        });
        setTouched({
            first_name: false,
            last_name: false,
            email: false,
            password: false
        });
        setMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate field in real-time if it's been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
        
        // Mark all fields as touched to show errors
        setTouched({
            first_name: true,
            last_name: true,
            email: true,
            password: true
        });
        
        // Validate all fields
        const newErrors = {
            first_name: !isLogin ? validateField('first_name', formData.first_name) : '',
            last_name: !isLogin ? validateField('last_name', formData.last_name) : '',
            email: validateField('email', formData.email),
            password: validateField('password', formData.password)
        };
        
        setErrors(newErrors);
        
        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error);
        if (hasErrors) return;
        
        setIsLoading(true);

        try {
            let response;
            if (isLogin) {
                // Login request
                response = await axios.post(`/api/teacher/login-teacher`, {
                    email: formData.email,
                    password: formData.password
                });

                localStorage.setItem('token', response.data.token);
                setMessage('Login successful! Redirecting...');
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.href = '/dashboard';
            } else {
                // Signup request
                response = await axios.post(`/api/teacher/signup`, {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password
                });

                setMessage('Account created successfully! You can now login.');
                await new Promise(resolve => setTimeout(resolve, 2000));
                setIsLogin(true);
                
                // Reset form after successful signup
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: ''
                });
                setTouched({
                    first_name: false,
                    last_name: false,
                    email: false,
                    password: false
                });
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const inputVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const errorVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        {/* Toggle buttons */}
                        <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
                            <button
                                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-center text-gray-500 mb-8">
                            {isLogin ? 'Sign in to access your dashboard' : 'Join us to get started'}
                        </p>

                        {/* Message alert */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`mb-6 p-4 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.first_name ? 'border-red-500' : touched.first_name && formData.first_name ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                            placeholder="John"
                                        />
                                        <AnimatePresence>
                                            {errors.first_name && touched.first_name && (
                                                <motion.p 
                                                    variants={errorVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="mt-1 text-sm text-red-600 overflow-hidden"
                                                >
                                                    {errors.first_name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    <motion.div variants={inputVariants}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.last_name ? 'border-red-500' : touched.last_name && formData.last_name ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                            placeholder="Doe"
                                        />
                                        <AnimatePresence>
                                            {errors.last_name && touched.last_name && (
                                                <motion.p 
                                                    variants={errorVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="mt-1 text-sm text-red-600 overflow-hidden"
                                                >
                                                    {errors.last_name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            )}

                            <motion.div variants={inputVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : touched.email && formData.email && validateEmail(formData.email) ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="your@email.com"
                                    />
                                    {touched.email && formData.email && !errors.email && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute right-3 top-3 text-green-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {errors.email && touched.email && (
                                        <motion.p 
                                            variants={errorVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="mt-1 text-sm text-red-600 overflow-hidden"
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div variants={inputVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : touched.password && formData.password && formData.password.length >= 6 ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="••••••••"
                                    />
                                    {touched.password && formData.password && !errors.password && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute right-3 top-3 text-green-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {errors.password && touched.password && (
                                        <motion.p 
                                            variants={errorVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="mt-1 text-sm text-red-600 overflow-hidden"
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                {touched.password && formData.password && !errors.password && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-1 text-xs text-green-600"
                                    >
                                        Password strength: <span className="font-medium">Good</span>
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div variants={inputVariants} className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!isValid || isLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isValid 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {isLoading ? (
                                        <motion.span 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="flex items-center justify-center"
                                        >
                                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </motion.span>
                                    ) : isLogin ? 'Sign In' : 'Sign Up'}
                                </button>
                            </motion.div>
                        </form>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mt-6"
                        >
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={handleAuthToggle}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;