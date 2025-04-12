import React from 'react';
import Navbar from './Navbar';
import Footer from "./Footer.jsx";
const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;