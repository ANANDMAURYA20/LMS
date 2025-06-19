import React from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children, hideBar, hideNav, hideFooter }) {
  return (
    <>
      <main className="min-h-screen bg-black text-white transition-colors duration-300">
        {/* Navbar */}
        {!hideNav && <Navbar />}

        {/* WhatsApp Link */}
        <a href="https://wa.me/ " target="_blank" rel="noopener noreferrer"></a>

        {/* Sidebar */}
        {!hideBar && <Sidebar />}

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && <Footer />}
      </main>
    </>
  );
}
