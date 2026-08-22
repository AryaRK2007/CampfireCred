import React, { useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Simulated logged-in user state
  const user = {
    name: "Arya Koshti",
    email: "arya.k@sst.scaler.com",
    cred: 850,
    initials: "AK"
  };

  const handleLogin = () => {
    const email = prompt("Enter your student email to sign in:");
    if (email && email.endsWith("@sst.scaler.com")) {
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError("Access restricted. Please use a valid @sst.scaler.com email.");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg text-lg flex items-center justify-center">
              🔥
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Campfire<span className="text-indigo-600">Cred</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 px-1 py-5">Feed</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Leaderboard</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Mentors</a>
          </div>

          {/* Authentication Area */}
          <div className="flex items-center space-x-4">
            {authError && <span className="text-red-500 text-sm hidden sm:block">{authError}</span>}
            
            {!isLoggedIn ? (
              <button 
                onClick={handleLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all text-sm sm:text-base"
              >
                Student Login
              </button>
            ) : (
              <div className="flex items-center space-x-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <div className="flex items-center justify-end space-x-1 text-xs font-medium text-indigo-600 mt-0.5">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {user.cred} Cred
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                  {user.initials}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}
