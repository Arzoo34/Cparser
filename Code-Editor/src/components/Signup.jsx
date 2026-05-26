import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCode, FaUser, FaLock, FaEnvelope, FaKey, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    const result = await sendOTP(email);
    setIsLoading(false);

    if (result.success) {
      setStep(2);
      setSuccess('OTP sent to your email! Please check your inbox.');
      setResendCooldown(60); // 60 seconds cooldown

      // Start countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError(result.error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    const result = await verifyOTP(email, otp, name, password);
    setIsLoading(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setIsLoading(true);
    const result = await sendOTP(email);
    setIsLoading(false);

    if (result.success) {
      setSuccess('OTP resent to your email!');
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <FaCode className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-gray-300">
              {step === 1 ? 'Join our code editor platform' : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password (min. 6 characters)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400 text-center">
                  We sent a 6-digit code to <span className="text-purple-300">{email}</span>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 border border-gray-600"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-sm text-purple-300 hover:text-purple-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  <FaRedo className={resendCooldown > 0 ? 'animate-spin' : ''} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : 'Resend OTP'}
                  </span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-purple-200 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
