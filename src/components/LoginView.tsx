'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserAccount, PRESET_ACCOUNTS } from '@/data/authData';

interface LoginProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PRESET_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      setErrorMessage('Invalid Email ID or Password. Please select a credential from the list below.');
    }
  };

  const selectPreset = (account: UserAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Soothing Brand Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 text-white font-bold text-xl mb-3 border border-slate-800 shadow-sm">
          SS
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          S S CONSULTANCYY
        </h1>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
          Industrial & Labour Law Consultant — HRMS Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* Main Login Card */}
        <div className="bg-white py-8 px-6 border border-slate-300 shadow-sm sm:px-10 space-y-6">
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">Sign In to Enterprise Workspace</h2>
            <p className="text-xs text-slate-500 mt-0.5">Role-Based Authentication Engine</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">User Email ID *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@ssconsultancy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Credentials */}
          <div className="pt-5 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Select Preset Account (Click to Fill)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">5 Roles Available</span>
            </div>

            <div className="space-y-2">
              {PRESET_ACCOUNTS.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => selectPreset(acc)}
                    className={`w-full text-left p-3 border text-xs transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                        {acc.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{acc.name}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-mono border border-blue-200 font-semibold">
                            {acc.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: <span className="font-semibold text-slate-800">{acc.email}</span> | Pass: <span className="font-bold text-blue-600">{acc.password}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4 font-medium">
          S S CONSULTANCYY Industrial & Labour Law System • Enterprise Web Application
        </p>
      </div>
    </div>
  );
};
