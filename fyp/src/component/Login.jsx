import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuthToggle = () => {
        setIsLogin(!isLogin);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        });
        setMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');
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
                setMessage('Login successful!');
                navigate('/dashboard');
            } else {
                // Signup request
                response = await axios.post(`/api/teacher/signup`, {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password
                });

                setMessage('Account created successfully! You can now login.');
                setIsLogin(true);
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="card bg-white shadow-xl">
                    <div className="card-body">
                        {/* Toggle buttons */}
                        <div className="tabs tabs-boxed bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                className={`tab tab-lg flex-1 ${isLogin ? 'tab-active' : ''}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                            <button
                                className={`tab tab-lg flex-1 ${!isLogin ? 'tab-active' : ''}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>

                        <h2 className="card-title text-2xl font-bold text-center mb-6">
                            {isLogin ? 'Teacher Login' : 'Teacher Sign Up'}
                        </h2>

                        {/* Message alert */}
                        {message && (
                            <div className={`alert ${isError ? 'alert-error' : 'alert-success'} mb-4`}>
                                <div>
                                    <span>{message}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">First Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Last Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-4">
                            {isLogin ? (
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={handleAuthToggle}
                                        className="link link-primary"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        onClick={handleAuthToggle}
                                        className="link link-primary"
                                    >
                                        Login
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;