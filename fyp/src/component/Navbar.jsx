import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    BookText, LineChart, ClipboardList, PlayCircle, User,
    LogOut, Menu, X, Home, BookPlus, Users, BarChart
} from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Load user from token on component mount and token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    user_id: decodedToken.user_id,
                    role: decodedToken.role,
                    first_name: decodedToken.first_name,
                });
            } catch (error) {
                console.error('Failed to decode token:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('[aria-label="Toggle menu"]')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        navigate('/login');
    };

    // Safely get user initials
    const getUserInitial = () => {
        if (!user) return 'U';
        if (user.first_name) return user.first_name.charAt(0).toUpperCase();
        if (user.name) return user.name.charAt(0).toUpperCase();
        return 'U';
    };

    const navLinks = {
        teacher: [
            { path: "/dashboard", name: "Dashboard", icon: <Home size={18} /> },
            { path: "/classes", name: "My Classes", icon: <BookPlus size={18} /> },
            { path: "/stats", name: "Statistics", icon: <LineChart size={18} /> },
            { path: "/session-logs", name: "Session Logs", icon: <ClipboardList size={18} /> },
            { path: "/start-session", name: "Start Session", icon: <PlayCircle size={18} /> }
        ],
        admin: [
            { path: "/admin/teachers", name: "View Teachers", icon: <Users size={18} /> },
            { path: "/admin/stats", name: "Overall Stats", icon: <BarChart size={18} /> }
        ],
        unregistered: []
    };

    const renderNavLink = (link) => (
        <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800/50'
            }`}
        >
            {link.icon}
            <span className="text-sm font-medium">{link.name}</span>
        </Link>
    );

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-blue-900/90 backdrop-blur-md shadow-lg' : 'bg-blue-900'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
                        aria-label="Home"
                    >
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
                            {user && (
                                <>
                                    {user.role === 'teacher' && navLinks.teacher.map(renderNavLink)}
                                    {user.role === 'admin' && navLinks.admin.map(renderNavLink)}
                                </>
                            )}
                        </div>

                        {/* Auth Section */}
                        <div className="ml-4 h-full flex items-center border-l border-blue-700 pl-4">
                            {!user ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-1.5 text-sm text-blue-100 hover:text-white transition-colors"
                                    >
                                        Login / Regiser
                                    </Link>
                                </div>
                            ) : (
                                <div ref={profileRef} className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 focus:outline-none"
                                        aria-label="User menu"
                                        aria-expanded={isProfileOpen}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {getUserInitial()}
                      </span>
                                        </div>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-blue-800 rounded-md shadow-lg ring-1 ring-blue-700 z-10">
                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-700"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <User size={16} className="mr-2" />
                                                    Profile
                                                    <span className="ml-auto bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-700"
                                                >
                                                    <LogOut size={16} className="mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div ref={mobileMenuRef} className="lg:hidden pb-4">
                        <div className="pt-2 space-y-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                    >
                                        Login / Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {user.role === 'teacher' && navLinks.teacher.map(renderNavLink)}
                                    {user.role === 'admin' && navLinks.admin.map(renderNavLink)}
                                    <div className="border-t border-blue-700 pt-2 mt-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800/50 transition-colors"
                                        >
                                            <User size={16} />
                                            <span className="text-sm font-medium">Profile</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
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