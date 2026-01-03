import React, { useState, useEffect } from 'react';
import { Bulletin, BulletinFormData } from '../types';
import { getBulletins, saveBulletin, deleteBulletin } from '../services/storageService';
import { generateDevotionalSummary } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminView: React.FC = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [formData, setFormData] = useState<BulletinFormData>({
    title: '',
    publishDate: new Date().toISOString().split('T')[0],
    driveLink: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSummary, setAutoSummary] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch data
  const refreshBulletins = async () => {
    setIsLoading(true);
    try {
      const data = await getBulletins();
      setBulletins(data);
    } catch (error) {
      console.error("Failed to load bulletins", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        refreshBulletins();
      }
    });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateSummary = async () => {
    if (!formData.title) {
      alert("Mohon isi judul terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    try {
      const summary = await generateDevotionalSummary(formData.title, formData.publishDate);
      setAutoSummary(summary);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat ringkasan AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.driveLink || !formData.publishDate) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await saveBulletin(formData, editingId || undefined, autoSummary);
      
      setFormData({
        title: '',
        publishDate: new Date().toISOString().split('T')[0],
        driveLink: ''
      });
      setAutoSummary('');
      setEditingId(null);
      await refreshBulletins();
      alert(editingId ? "Warta berhasil diperbarui!" : "Warta berhasil disimpan!");
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleEdit = (bulletin: Bulletin) => {
    setFormData({
      title: bulletin.title,
      publishDate: bulletin.publishDate,
      driveLink: bulletin.driveLink
    });
    setAutoSummary(bulletin.summary || '');
    setEditingId(bulletin.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      publishDate: new Date().toISOString().split('T')[0],
      driveLink: ''
    });
    setAutoSummary('');
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah anda yakin ingin menghapus warta ini?")) {
      try {
        await deleteBulletin(id);
        await refreshBulletins();
      } catch (error: any) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  // Filter Logic
  const filteredBulletins = bulletins.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.publishDate.includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1 order-1 lg:order-1">
          <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 static lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-cloud-arrow-up'} text-primary`}></i>
              {editingId ? 'Edit Warta' : 'Upload Warta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish</label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Warta</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Contoh: Warta Minggu I Oktober"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Drive</label>
                <input
                  type="url"
                  name="driveLink"
                  placeholder="https://drive.google.com/..."
                  value={formData.driveLink}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* AI Feature */}
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Assistant
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating || !formData.title}
                    className="text-xs w-full sm:w-auto bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50 text-center"
                  >
                    {isGenerating ? 'Memproses...' : 'Buat Refleksi Singkat'}
                  </button>
                </div>
                {autoSummary ? (
                   <p className="text-xs text-gray-700 italic">"{autoSummary}"</p>
                ) : (
                  <p className="text-xs text-gray-500">Klik tombol untuk membuat kata penyemangat otomatis berdasarkan judul.</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition-colors shadow-md disabled:opacity-50 text-sm md:text-base"
                >
                  {isLoading ? 'Loading...' : (editingId ? 'Update Warta' : 'Simpan Warta')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition-colors text-sm md:text-base"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 order-2 lg:order-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-bold text-gray-800 text-sm md:text-base">Daftar Warta Terupload</h2>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                {filteredBulletins.length} File
              </span>
            </div>

            {/* Search Bar for Admin */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Cari warta berdasarkan judul atau tanggal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            {isLoading ? (
               <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                  <p>Mengambil data...</p>
               </div>
            ) : filteredBulletins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? "Warta tidak ditemukan." : "Belum ada data. Silakan upload warta baru."}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBulletins.map((b) => (
                  <div key={b.id} className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors gap-3 md:gap-4 ${editingId === b.id ? 'bg-blue-50' : ''}`}>
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                          {b.publishDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">{b.title}</h4>
                      <a 
                        href={b.driveLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm text-blue-600 hover:underline truncate block max-w-full sm:max-w-xs"
                      >
                        {b.driveLink}
                      </a>
                      {b.summary && <p className="text-xs text-gray-500 mt-1 italic">"{b.summary}"</p>}
                    </div>
                    
                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="Edit Warta"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Hapus Warta"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;