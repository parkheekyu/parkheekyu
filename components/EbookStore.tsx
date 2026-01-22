
import React, { useState, useMemo } from 'react';
import { CATEGORIES, MOCK_EBOOKS } from '../constants';
import { EbookItem } from '../types';
import EbookCard from './ClassCard';
import Header from './Header';

interface EbookStoreProps {
  onBack: () => void;
  onDetail: (item: EbookItem) => void;
  initialCategory?: string;
}

type SortOption = 'popular' | 'latest' | 'price-low' | 'price-high';

const EbookStore: React.FC<EbookStoreProps> = ({ onBack, onDetail, initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedEbooks = useMemo(() => {
    let list = [...MOCK_EBOOKS];
    
    // Filtering
    if (selectedCategory !== 'all') {
      const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name;
      list = list.filter(item => item.category === categoryName);
    }
    
    if (searchQuery) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'latest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
    }

    return list;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Header 
        onNavigate={(page) => {
            if (page === 'home') onBack();
            // In a real app, you'd handle more routing here
        }} 
        onSearch={setSearchQuery} 
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-dark tracking-tighter">
              전자책 <span className="text-brand-primary">스토어</span>
            </h2>
            <p className="text-brand-gray font-medium text-sm mt-1">
              {filteredAndSortedEbooks.length}개의 프리미엄 지식이 당신을 기다리고 있습니다.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer shadow-sm"
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                        : 'text-gray-500 hover:bg-brand-accent/50 hover:text-brand-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    {selectedCategory === cat.id && <span className="text-[10px]">●</span>}
                  </button>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50">
                <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-6">Price Range</h3>
                <div className="space-y-3">
                  {['전체', '1만원 이하', '1~3만원', '3만원 이상'].map((range) => (
                    <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-brand-primary transition-colors flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full opacity-0"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 group-hover:text-brand-dark transition-colors">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {filteredAndSortedEbooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {filteredAndSortedEbooks.map((item) => (
                  <div key={item.id} onClick={() => onDetail(item)}>
                    <EbookCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
                <div className="text-5xl mb-6">🔍</div>
                <h4 className="text-xl font-black text-brand-dark mb-2">검색 결과가 없습니다</h4>
                <p className="text-brand-gray font-medium text-sm">다른 키워드나 카테고리로 검색해보세요.</p>
                <button 
                  onClick={() => {setSelectedCategory('all'); setSearchQuery('');}}
                  className="mt-8 bg-brand-primary text-white px-6 py-2.5 rounded-xl text-xs font-black"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookStore;
