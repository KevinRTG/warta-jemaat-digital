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
      <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="https://sinodegko.org/wp-content/uploads/2021/08/logo_transparanresize.png" 
            alt="Logo GKO Cibitung" 
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full object-contain p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0" 
          />
          <div className="text-center sm:text-left">
            <h1 className="text-white font-bold text-lg md:text-xl leading-tight">GKO Cibitung</h1>
            <p className="text-blue-200 text-[10px] md:text-xs font-medium tracking-wider">WARTA JEMAAT DIGITAL</p>
          </div>
        </Link>

        <nav className="w-full sm:w-auto">
          <ul className="flex gap-2 md:gap-4 text-xs md:text-sm font-medium items-center justify-center sm:justify-end">
            <li>
              <Link 
                to="/" 
                className={`text-blue-100 hover:text-white transition-colors py-2 px-2 ${location.pathname === '/' ? 'text-white font-bold' : ''}`}
              >
                Jemaat
              </Link>
            </li>
            
            {isAdminLoggedIn ? (
              <>
                 <li>
                  <Link 
                    to="/admin" 
                    className={`text-blue-100 hover:text-white transition-colors py-2 px-2 ${location.pathname === '/admin' ? 'text-white font-bold' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="bg-secondary text-white px-3 py-1.5 md:py-2 rounded hover:bg-blue-900 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className={`bg-secondary text-white px-3 py-1.5 md:py-2 rounded hover:bg-blue-900 transition-colors ${location.pathname === '/login' ? 'ring-2 ring-blue-300' : ''}`}
                >
                  Portal
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