import React from 'react';
import { Bulletin } from '../types';

interface BulletinCardProps {
  bulletin: Bulletin;
}

const BulletinCard: React.FC<BulletinCardProps> = ({ bulletin }) => {
  const dateObj = new Date(bulletin.publishDate);
  const day = dateObj.toLocaleDateString('id-ID', { day: 'numeric' });
  const month = dateObj.toLocaleDateString('id-ID', { month: 'long' });
  const year = dateObj.toLocaleDateString('id-ID', { year: 'numeric' });
  const fullDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group overflow-hidden">
      {/* Top Decoration Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        {/* Header: Date Badge & Meta */}
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 text-primary rounded-lg px-3 py-1.5 flex flex-col items-center min-w-[60px] border border-blue-100">
            <span className="text-xl font-bold leading-none">{day}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">{dateObj.toLocaleDateString('id-ID', { month: 'short' })}</span>
          </div>
          <div className="text-right">
             <span className="text-xs font-medium text-gray-400 block">{year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4 flex-grow">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
            <a href={bulletin.driveLink} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
              {bulletin.title}
            </a>
          </h3>
          
          {bulletin.summary ? (
            <div className="flex items-start gap-2 mt-3">
              <i className="fa-solid fa-quote-left text-accent/50 text-xs mt-1 shrink-0"></i>
              <p className="text-gray-600 text-sm italic line-clamp-3 leading-relaxed">
                {bulletin.summary}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic mt-2">
              Klik tombol di bawah untuk melihat detail warta.
            </p>
          )}
        </div>

        {/* Footer / Action */}
        <div className="mt-auto pt-4 border-t border-gray-50">
           <a 
            href={bulletin.driveLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-secondary py-2.5 px-4 rounded-lg transition-colors shadow-sm group-hover:shadow-md"
          >
            <i className="fa-regular fa-file-pdf"></i>
            Baca Warta
          </a>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-400">{fullDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinCard;