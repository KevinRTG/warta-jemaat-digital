import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Gereja Kristen Oikoumene (GKO) Cibitung.
        </p>
        <p className="text-xs mt-2">
          Dilayani dengan Kasih.
        </p>
      </div>
    </footer>
  );
};

export default Footer;