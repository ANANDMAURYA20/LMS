import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const curDate = new Date();
  const year = curDate.getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaGraduationCap className="text-orange-500 mr-2" />
              LearnSmart
            </h3>
            <p className="text-gray-400 mb-4">
              Empowering learners worldwide with quality education and innovative learning solutions.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons */}
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">All Courses</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Contact</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>1234 Education Street</li>
              <li>New York, NY 10001</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@learnsmart.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-400">
            © {year} LearnSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
