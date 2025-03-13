import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function Welcome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to PAT Extension</h1>
          <p className="text-xl text-gray-600">
            Enhance your Amazon Relay experience with powerful tools
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Order Management</h2>
            <p className="text-gray-700">
              Easily manage your orders with bulk operations, custom filters, and more.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Loadboard Tools</h2>
            <p className="text-gray-700">
              Find the best loads quickly with enhanced search and filtering capabilities.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">Driver Management</h2>
            <p className="text-gray-700">
              Track and manage your drivers efficiently across all your orders.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">International Support</h2>
            <p className="text-gray-700">
              Works across all Amazon Relay domains worldwide.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Get started by visiting Amazon Relay and using the extension's tools on the loadboard and orders pages.
          </p>
          
          <a 
            href="https://relay.amazon.com/loadboard" 
            target="_blank" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Go to Amazon Relay
          </a>
        </div>
      </div>
      
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>PAT Extension © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<Welcome />);

export default Welcome;