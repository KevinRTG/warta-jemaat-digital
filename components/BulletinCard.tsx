import React from 'react';
import { Bulletin } from '../types';

interface BulletinCardProps {
  bulletin: Bulletin;
}

const BulletinCard: React.FC<BulletinCardProps> = ({ bulletin }) => {
  const dateObj = new Date(bulletin.publishDate);
  const day = dateObj.toLocaleDateString('id-ID', { day: 'numeric' });
  const month = dateObj.toLocaleDateString('id-ID', { month: 'short' });
  const year = dateObj.toLocaleDateString('id-ID', { year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="flex flex-col md:flex-row h-full">
        {/* Date Column */}
        <div className="bg-blue-50 text-primary p-4 md:w-24 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-blue-100 shrink-0">
          <span className="text-3xl font-bold leading-none">{day}</span>
          <span className="uppercase text-sm font-semibold tracking-wide">{month}</span>
          <span className="text-xs text-gray-500 mt-1">{year}</span>
        </div>

        {/* Content Column */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors mb-2">
              <a href={bulletin.driveLink} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-2 decoration-accent">
                {bulletin.title}
              </a>
            </h3>
            {bulletin.summary && (
              <p className="text-gray-600 text-sm italic border-l-2 border-accent pl-3">
                "{bulletin.summary}"
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-end">
             <a 
              href={bulletin.driveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
            >
              <i className="fa-regular fa-file-pdf"></i>
              Buka Warta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinCard;