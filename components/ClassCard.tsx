
import React from 'react';
import { EbookItem } from '../types';

interface EbookCardProps {
  item: EbookItem;
}

const EbookCard: React.FC<EbookCardProps> = ({ item }) => {
  return (
    <div className="group cursor-pointer bg-transparent transition-all duration-300">
      <div className="relative aspect-[3/4.2] mb-3 group-hover:-translate-y-1 transition-transform duration-300">
        <div className="w-full h-full overflow-hidden rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow border border-gray-100">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="object-cover w-full h-full grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {item.isBestseller && (
            <span className="bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              BEST
            </span>
          )}
          {item.isNew && (
            <span className="bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              NEW
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 z-20 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
          {item.pageCount}P
        </div>
      </div>

      <div className="px-0.5">
        <div className="text-[10px] font-bold text-brand-primary mb-1 uppercase tracking-tight">{item.category}</div>
        <h3 className="font-bold text-brand-dark text-[13px] md:text-sm mb-1.5 line-clamp-2 leading-tight h-8 md:h-9">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">{item.authorName}</span>
            <div className="flex items-center text-[10px] text-gray-400 mt-0.5">
              <span className="text-yellow-400">★</span>
              <span className="font-bold text-gray-700 ml-0.5">{item.rating}</span>
              <span className="ml-1 opacity-60">({item.reviewCount})</span>
            </div>
          </div>
          <div className="text-sm font-black text-brand-dark">
            {item.price.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookCard;
