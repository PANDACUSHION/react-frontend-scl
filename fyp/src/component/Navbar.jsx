import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';
import { BookText, LineChart, CalendarCheck, PlayCircle, User, LogOut, Menu, X, Home, BookPlus, ClipboardList } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode.jwtDecode(token);
                setUser({
                    user_id: decodedToken.user_id,
                    role: decodedToken.role,
                    first_name: decodedToken.first_name,
                });
            } catch (error) {
                console.error('Failed to decode token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const navLinks = {
        unregistered: [],
        teacher: [
            { path: "/dashboard", name: "Dashboard", icon: <Home size={18} /> },
            { path: "/classes", name: "My Classes", icon: <BookPlus size={18} /> },
            { path: "/stats", name: "Statistics", icon: <LineChart size={18} /> },
            { path: "/session-logs", name: "Session Logs", icon: <ClipboardList size={18} /> },
            { path: "/start-session", name: "Start Session", icon: <PlayCircle size={18} /> }
        ]
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                            <BookText className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                            Classroom Pro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center h-full">
                        <div className="flex items-center h-full gap-1">
                            {user ? (
                                navLinks.teacher.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="px-4 h-full flex items-center gap-2 text-blue-100 hover:bg-blue-800/50 transition-colors"
                                    >
                                        {link.icon}
                                        <span className="text-sm font-medium">{link.name}</span>
                                    </Link>
                                ))
                            ) : null}
                        </div>

                        {/* Auth Buttons */}
                        <div className="ml-4 h-full flex items-center border-l border-blue-700 pl-4">
                            {!user ? (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="px-4 py-1.5 text-sm text-blue-100 hover:text-white transition-colors">
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {(user.first_name || "T").charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-blue-800 rounded-box w-52 border border-blue-700">
                                        <li>
                                            <Link to={`/profile`} className="text-sm text-blue-100 hover:bg-blue-700">
                                                <User size={16} />
                                                Profile
                                                <span className="badge badge-sm bg-indigo-500 border-none text-white">
                                                    Teacher
                                                </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={logout} className="text-sm text-blue-100 hover:bg-blue-700">
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden pb-4">
                        <div className="pt-2 space-y-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center hover:from-blue-600 hover:to-indigo-600 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {navLinks.teacher.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                        >
                                            {link.icon}
                                            <span className="text-sm font-medium">{link.name}</span>
                                        </Link>
                                    ))}
                                    <div className="border-t border-blue-700 pt-2 mt-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                        >
                                            <User size={16} />
                                            <span className="text-sm font-medium">Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;