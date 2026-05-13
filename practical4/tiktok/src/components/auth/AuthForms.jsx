'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-center mb-1">Log in to TikTok</h2>
      <p className="text-gray-500 text-center text-sm mb-6">
        Manage your account, check notifications, comment on videos, and more
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
          required />
        <div>
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
            required />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500 cursor-pointer hover:underline">Forgot password?</span>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#FE2C55] hover:bg-[#e0264c] text-white font-bold rounded-lg transition disabled:opacity-60 text-sm">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-center text-sm mt-5 text-gray-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="text-[#FE2C55] font-bold hover:underline">
          Sign up
        </button>
      </p>
    </div>
  );
}

export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.name);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-center mb-1">Sign up for TikTok</h2>
      <p className="text-gray-500 text-center text-sm mb-6">
        Create a profile, follow other accounts, make your own videos, and more
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Full name" value={form.name} onChange={update('name')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm" />
        <input placeholder="Username" value={form.username} onChange={update('username')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm" required />
        <input type="email" placeholder="Email" value={form.email} onChange={update('email')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm" required />
        <input type="password" placeholder="Password (min 6 characters)" value={form.password}
          onChange={update('password')} minLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm" required />
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#FE2C55] hover:bg-[#e0264c] text-white font-bold rounded-lg transition disabled:opacity-60 text-sm mt-2">
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="text-center text-sm mt-5 text-gray-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-[#FE2C55] font-bold hover:underline">Log in</button>
      </p>
    </div>
  );
}