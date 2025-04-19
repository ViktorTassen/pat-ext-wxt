import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { User } from '../../utils/types'
import SignInPopup from './SignInPopup'
import { useLicense } from '../../hooks/useLicense'
import { auth } from '../../firebase/firebaseClient'
import { signOut } from 'firebase/auth/web-extension'

// Simple Skeleton component for loading states
const Skeleton = ({ className }: { className: string }) => {
  return <div className={`animate-pulse bg-gray-200 ${className}`}></div>
}

const AccountTab = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const licenseStatus = useLicense(user?.uid);
  const isLoading = licenseStatus.licenseStatus === "loading" || initialLoading;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      // Clear user data from storage
      chrome.storage.local.remove(['user'], () => {
        // Send message to update auth state
        chrome.runtime.sendMessage({ 
          type: 'AUTH_STATE_CHANGED',
          user: null
        });
        window.location.reload();
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckoutClick = async () => {
    setLoading(true);
    try {
      window.open('https://relaypatmanager.com/pricing', '_blank');
    } catch (error) {
      console.error('Error opening checkout page:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleManageClick = async () => {
    setLoading(true);
    try {
      window.open('https://relaypatmanager.com/account', '_blank');
    } catch (error) {
      console.error('Error opening account management page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-40 mb-1" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Profile Section with Help Links */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
              {user.displayName ? (
                <span className="text-base font-medium">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-medium text-gray-900 truncate">
                {user.displayName || "My Account"}
              </h2>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px] text-gray-400 truncate">ID: {user.uid}</span>
                <span className="text-[11px] text-gray-400">•</span>
                <span className={`text-[10px] px-1 py-0 rounded-full ${licenseStatus.license ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {licenseStatus.license ? "Active" : "Free"}
                </span>
              </div>
            </div>
          </div>


          <a
              href="https://relaypatmanager.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Docs</span>
            </a>

          {/* Help Links - Integrated into profile section */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
           
            <a
              href="mailto:support@relaypatmanager.com"
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>support@relaypatmanager.com</span>
            </a>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="ml-auto text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded px-2 py-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* License Status & Upgrade Section */}
      {!licenseStatus.license && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Upgrade to Pro</h3>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-900">Unlimited orders</p>
                  <p className="text-[11px] text-gray-500">Process unlimited loads at once</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-700 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-900">Advanced features</p>
                  <p className="text-[11px] text-gray-500">Access to all premium features</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg text-gray-400">$</span>
                <span className="text-3xl font-bold text-gray-900">29.99</span>
                <span className="text-xs text-gray-500">/mo</span>
              </div>
              <button
                onClick={handleCheckoutClick}
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-1 h-8 rounded text-xs">
                {loading ? "Processing..." : "Start 7 day free trial"}
              </button>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <span className="text-xs text-gray-500">Secure payments with Stripe</span>
            </div>
          </div>
        </div>
      )}

      {licenseStatus.license && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <button
            onClick={handleManageClick}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white h-8 rounded text-xs font-medium flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Manage Subscription
          </button>
          <p className="mt-2 text-[11px] text-center text-gray-500">
            Manage billing details and invoices
          </p>
        </div>
      )}
    </div>
  );
};

const Popup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const checkUserAuth = () => {
      setIsLoading(true);
      chrome.storage.local.get(['user'], (result) => {
        if (result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
        // Slight delay to ensure smooth transitions
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
    };
    
    // Initial check
    checkUserAuth();

    // Listen for auth state changes
    const handleMessage = (message: any) => {
      if (message.type === 'AUTH_STATE_CHANGED') {
        console.log('Auth state changed:', message.user);
        setUser(message.user);
        
        // If user is null (logged out), force refresh the popup
        if (!message.user) {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
      return true;
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Full account skeleton that matches the exact layout of the final component
  const AccountSkeleton = () => (
    <div className="flex flex-col h-full p-4 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-40 mb-1" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  // Use div with fixed height to prevent layout shift
  return (
    <div className="w-[400px] max-h-[500px] flex flex-col bg-surface account-container">
      {isLoading ? (
        <div className="animate-fadeIn">
          <AccountSkeleton />
        </div>
      ) : !user ? (
        <div className="animate-fadeIn">
          <SignInPopup />
        </div>
      ) : (
        <div className="animate-fadeIn">
          <AccountTab user={user} />
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('app')!)
root.render(<Popup />)