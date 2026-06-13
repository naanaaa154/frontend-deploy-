import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { useAuthActions, useAuthLoading } from '../hooks/use-auth';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { ThemeToggle } from '~/components/theme-toggle';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const navigate = useNavigate();
  const { register } = useAuthActions();
  const isLoading = useAuthLoading();
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      await register({ email, password, username, full_name: username });
      navigate('/login', { state: { pendingApproval: true } });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('/assets/images/img_bg_landing_page.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* Register Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join Notuly
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Create your account to get started
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm border border-red-200 dark:border-red-800/50 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.username
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>✕</span> {errors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.email
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>✕</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.password
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>✕</span> {errors.password}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              At least 8 characters recommended
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#034391] to-[#0256b8] hover:from-[#023068] hover:to-[#014a8f] text-white font-semibold py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#034391] focus:ring-offset-2 dark:focus:ring-offset-gray-800 h-auto shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;