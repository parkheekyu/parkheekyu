
import React, { useState } from 'react';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-18 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <h1 className="text-xl md:text-2xl font-black text-brand-dark tracking-tighter">
              디하클 <span className="text-brand-primary">전자책</span>
            </h1>
          </div>
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold text-gray-600">
            <button onClick={() => onNavigate('store')} className="hover:text-brand-primary transition-colors">전자책 스토어</button>
            <button onClick={() => onNavigate('my')} className="hover:text-brand-primary transition-colors">내 서재</button>
            <button onClick={() => onNavigate('studio')} className="hover:text-brand-primary transition-colors">작가 스튜디오</button>
          </nav>
        </div>
        
        <div className="flex-1 max-w-sm mx-8 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="무엇을 배우고 싶으신가요?" 
              className="w-full bg-gray-100 border-none rounded-full py-2.5 px-10 focus:ring-2 focus:ring-brand-primary/20 text-sm font-medium transition-all"
            />
            <button type="submit" className="absolute left-4 top-3 text-gray-400 hover:text-brand-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-4 text-sm font-bold">
          <button onClick={() => onNavigate('login')} className="text-gray-500 hover:text-brand-dark transition-colors">로그인</button>
          <button onClick={() => onNavigate('studio')} className="bg-brand-primary text-white px-5 py-2 rounded-full hover:bg-brand-secondary transition shadow-sm shadow-brand-primary/20">작가 신청</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
