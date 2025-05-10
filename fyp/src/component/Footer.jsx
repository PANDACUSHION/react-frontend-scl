import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaBook, FaChalkboardTeacher, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setSubscribeStatus('error');
            return;
        }
        setSubscribeStatus('success');
        setEmail('');
        setTimeout(() => setSubscribeStatus(''), 3000);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-base-200 to-base-300 text-base-content border-t border-base-300/50">
            {/* Main Footer Content */}
            <div className="footer p-10 max-w-7xl mx-auto">
                {/* Brand Section */}
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FaChalkboardTeacher className="text-2xl text-primary" />
                        </div>
                        <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Classroom Pro
                        </h2>
                    </div>
                    <p className="mt-3 text-base-content/70 text-sm leading-relaxed">
                        Empowering educators with intelligent classroom solutions since 2025
                    </p>
                    <div className="mt-5 flex gap-3">
                        <a href="#" aria-label="Twitter" className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all">
                            <FaTwitter className="text-lg" />
                        </a>
                        <a href="#" aria-label="GitHub" className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all">
                            <FaGithub className="text-lg" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all">
                            <FaLinkedin className="text-lg" />
                        </a>
                        <a href="#" aria-label="YouTube" className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all">
                            <FaYoutube className="text-lg" />
                        </a>
                        <a href="#" aria-label="Documentation" className="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all">
                            <FaBook className="text-lg" />
                        </a>
                    </div>
                </div>

                {/* Services Links */}
                <div>
                    <h3 className="footer-title opacity-90">Services</h3>
                    <ul className="space-y-2">
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Class Management
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Session Analytics
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Student Tracking
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h3 className="footer-title opacity-90">Company</h3>
                    <ul className="space-y-2">
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                About us
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Contact
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Careers
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div>
                    <h3 className="footer-title opacity-90">Legal</h3>
                    <ul className="space-y-2">
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Terms of use
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Privacy policy
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Cookie policy
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-1">
                                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                GDPR Compliance
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="footer-title opacity-90">Stay Updated</h3>
                    <p className="mb-3 text-sm text-base-content/70">
                        Subscribe to our newsletter for the latest features and updates
                    </p>
                    <form onSubmit={handleSubscribe} className="mt-2">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (subscribeStatus === 'error') setSubscribeStatus('');
                                }}
                                placeholder="your-email@example.com"
                                className={`input input-bordered w-full pr-12 ${subscribeStatus === 'error' ? 'input-error' : ''}`}
                                aria-label="Email for newsletter"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm hover:bg-transparent hover:text-primary"
                                aria-label="Subscribe to newsletter"
                            >
                                <MdSend className="text-xl" />
                            </button>
                        </div>
                        {subscribeStatus === 'error' && (
                            <p className="text-error text-xs mt-1 animate-fade-in">Please enter a valid email address</p>
                        )}
                        {subscribeStatus === 'success' && (
                            <p className="text-success text-xs mt-1 animate-fade-in">
                                Subscribed successfully! <span className="inline-block animate-bounce">🎉</span>
                            </p>
                        )}
                    </form>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <div className="badge badge-outline badge-sm border-primary/30 text-primary/80">Certified EdTech</div>
                        <div className="badge badge-outline badge-sm border-primary/30 text-primary/80">FERPA Compliant</div>
                        <div className="badge badge-outline badge-sm border-primary/30 text-primary/80">ISO 27001</div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-base-300/30">
                <div className="max-w-7xl mx-auto py-4 px-10 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="text-xs text-base-content/50">
                        © {currentYear} Classroom Pro. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="text-base-content/50 flex items-center">
                            Made with <span className="text-red-400 mx-1">♥</span> for educators worldwide
                        </div>
                        <select 
                            className="select select-ghost select-xs focus:outline-none text-base-content/50 bg-transparent"
                            defaultValue="en"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;