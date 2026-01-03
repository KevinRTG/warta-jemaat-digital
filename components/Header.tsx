import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white p-2 rounded-full text-primary w-10 h-10 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-church"></i>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">GKO Cibitung</h1>
            <p className="text-blue-200 text-xs font-medium tracking-wider">WARTA JEMAAT DIGITAL</p>
          </div>
        </Link>

        <nav>
          <ul className="flex gap-4 text-sm font-medium items-center">
            <li>
              <Link 
                to="/" 
                className="text-blue-100 hover:text-white transition-colors"
              >
                Jemaat
              </Link>
            </li>
            
            {isAdminLoggedIn ? (
              <>
                 <li>
                  <Link 
                    to="/admin" 
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="bg-secondary text-white px-3 py-2 rounded hover:bg-blue-900 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Keluar
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className="bg-secondary text-white px-3 py-2 rounded hover:bg-blue-900 transition-colors"
                >
                  Login Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;