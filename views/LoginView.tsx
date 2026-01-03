import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login Gagal: ' + error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-6">
          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm">Masuk untuk mengelola warta jemaat.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="admin@gkocibitung.or.id"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;