import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaBook, FaChalkboardTeacher, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) {
            setSubscribeStatus('error');
            return;
        }
        // Simulate successful subscription
        setSubscribeStatus('success');
        setEmail('');
        // In a real app, you would make an API call here
        setTimeout(() => setSubscribeStatus(''), 3000);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-200 text-base-content">
            {/* Main Footer Content */}
            <div className="footer p-10 max-w-7xl mx-auto">
                {/* Brand Section */}
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                        <FaChalkboardTeacher className="text-4xl text-primary" />
                        <h2 className="font-bold text-xl">Classroom Pro</h2>
                    </div>
                    <p className="mt-2 text-base-content/80">Empowering educators with intelligent classroom solutions since 2023</p>
                    <div className="mt-4 flex gap-4">
                        <a href="#" aria-label="Twitter" className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10">
                            <FaTwitter className="text-lg" />
                        </a>
                        <a href="#" aria-label="GitHub" className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10">
                            <FaGithub className="text-lg" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10">
                            <FaLinkedin className="text-lg" />
                        </a>
                        <a href="#" aria-label="YouTube" className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10">
                            <FaYoutube className="text-lg" />
                        </a>
                        <a href="#" aria-label="Documentation" className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10">
                            <FaBook className="text-lg" />
                        </a>
                    </div>
                </div>

                {/* Services Links */}
                <div>
                    <h3 className="footer-title">Services</h3>
                    <ul className="space-y-2">
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Class Management</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Session Analytics</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Student Tracking</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Lesson Planning</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Attendance System</a></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h3 className="footer-title">Company</h3>
                    <ul className="space-y-2">
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">About us</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Contact</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Careers</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Press kit</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Partners</a></li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div>
                    <h3 className="footer-title">Legal</h3>
                    <ul className="space-y-2">
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Terms of use</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Privacy policy</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Cookie policy</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">GDPR Compliance</a></li>
                        <li><a className="link link-hover transition-all hover:text-primary hover:translate-x-1 inline-flex">Data Processing</a></li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="footer-title">Stay Updated</h3>
                    <p className="mb-3">Subscribe to our newsletter for the latest features and updates</p>
                    <form onSubmit={handleSubscribe} className="mt-2">
                        <div className="join w-full">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your-email@example.com"
                                className={`input input-bordered join-item flex-grow ${subscribeStatus === 'error' ? 'input-error' : ''}`}
                                aria-label="Email for newsletter"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary join-item"
                                aria-label="Subscribe to newsletter"
                            >
                                <MdSend className="text-lg" />
                            </button>
                        </div>
                        {subscribeStatus === 'error' && <p className="text-error text-sm mt-1">Please enter a valid email</p>}
                        {subscribeStatus === 'success' && <p className="text-success text-sm mt-1">Thanks for subscribing!</p>}
                    </form>
                    <div className="mt-4">
                        <div className="badge badge-outline">Certified EdTech</div>
                        <div className="badge badge-outline ml-2">FERPA Compliant</div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-base-300">
                <div className="max-w-7xl mx-auto py-4 px-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-base-content/70">
                        © {currentYear} Classroom Pro. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="text-base-content/70">
                            Made with <span className="text-red-500">♥</span> for educators worldwide
                        </div>
                        <select className="select select-ghost select-xs" defaultValue="en">
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