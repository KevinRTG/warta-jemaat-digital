import React, { useEffect, useState } from 'react';
import { Bulletin } from '../types';
import { getBulletins } from '../services/storageService';
import BulletinCard from '../components/BulletinCard';

const UserView: React.FC = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBulletins();
      setBulletins(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Get unique years from data for dropdown
  const uniqueYears = Array.from(new Set(bulletins.map(b => new Date(b.publishDate).getFullYear())))
    .sort((a, b) => b - a);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const filteredBulletins = bulletins.filter(b => {
    const date = new Date(b.publishDate);
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.publishDate.includes(searchQuery);
    
    const matchesYear = selectedYear === 'all' || date.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === 'all' || date.getMonth().toString() === selectedMonth;

    return matchesSearch && matchesYear && matchesMonth;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary to-primary text-white pt-12 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <i className="fa-solid fa-church absolute -right-10 -bottom-10 text-9xl"></i>
           <i className="fa-solid fa-cross absolute left-10 top-10 text-6xl"></i>
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Arsip Warta Jemaat</h2>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Akses dokumen digital warta jemaat mingguan GKO Cibitung dengan mudah dan cepat di mana saja.
          </p>
        </div>
      </div>

      {/* Search & Filter Section (Floating) */}
      <div className="container mx-auto px-4 max-w-5xl -mt-10 relative z-20 mb-10">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Text Search */}
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Cari judul warta atau tanggal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-700"
            />
          </div>

          {/* Date Filters */}
          <div className="flex gap-3 w-full md:w-auto">
             <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-1/2 md:w-40 bg-gray-50 border-none text-gray-700 py-3 px-4 rounded-lg focus:ring-2 focus:ring-primary cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="all">Tahun</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-1/2 md:w-40 bg-gray-50 border-none text-gray-700 py-3 px-4 rounded-lg focus:ring-2 focus:ring-primary cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="all">Bulan</option>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 max-w-6xl pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full mb-4" role="status"></div>
            <p className="text-gray-500 font-medium">Sedang memuat data...</p>
          </div>
        ) : filteredBulletins.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-regular fa-folder-open text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Tidak ditemukan</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {searchQuery || selectedYear !== 'all' || selectedMonth !== 'all' 
                ? `Tidak ada warta yang cocok dengan pencarian Anda.` 
                : "Belum ada warta yang diunggah saat ini."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="font-bold text-gray-800 text-lg">
                Daftar Warta
              </h3>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                Menampilkan {filteredBulletins.length} dokumen
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBulletins.map((bulletin) => (
                <BulletinCard key={bulletin.id} bulletin={bulletin} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserView;