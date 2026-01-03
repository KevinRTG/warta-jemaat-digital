import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserView from './views/UserView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<UserView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;