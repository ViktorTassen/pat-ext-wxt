import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { User } from '../../utils/types'
import SignInPopup from './SignInPopup'

const AccountTab = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">PAT Extension</h1>
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded">
          <h2 className="font-semibold text-gray-800 mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
              Go to Loadboard
            </button>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition">
              View Settings
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

const Popup = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    chrome.storage.local.get(['user'], (result) => {
      if (result.user) {
        setUser(result.user);
      }
    });

    // Listen for auth state changes
    const handleMessage = (message: any) => {
      if (message.type === 'AUTH_STATE_CHANGED') {
        setUser(message.user);
      }
      return true;
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="w-[400px] max-h-[500px] flex flex-col bg-surface">
      {!user ? <SignInPopup /> : <AccountTab />}
    </div>
  );
}

const root = createRoot(document.getElementById('app')!)
root.render(<Popup />)