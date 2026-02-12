import React from 'react';
import NavBar from '../components/Navbar/NavBar';
import Footer from '../components/Navbar/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;