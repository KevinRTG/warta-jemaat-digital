import React, { useEffect, useState } from 'react';
import { Bulletin } from '../types';
import { getBulletins } from '../services/storageService';
import BulletinCard from '../components/BulletinCard';

const UserView: React.FC = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBulletins();
      // Data is already sorted by the DB, but to be safe/consistent:
      setBulletins(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Arsip Warta Jemaat</h2>
        <p className="text-gray-600">
          Silakan klik judul atau tombol untuk mengakses dokumen digital warta.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></div>
          <p className="mt-2 text-gray-500">Memuat warta...</p>
        </div>
      ) : bulletins.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
          <i className="fa-regular fa-folder-open text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">Belum ada warta yang diunggah.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bulletins.map((bulletin) => (
            <BulletinCard key={bulletin.id} bulletin={bulletin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserView;