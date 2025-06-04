import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container-lg py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-4">MediDiagnose AI</h4>
            <p className="text-gray-600 mb-4">
              Leveraging advanced AI to provide accurate medical diagnoses from your reports.
              Our platform combines OCR technology with machine learning models to deliver
              insights that help healthcare professionals and patients alike.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  New Diagnosis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Data Usage
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MediDiagnose AI. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center">
            Made with <Heart size={16} className="text-red-500 mx-1" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;