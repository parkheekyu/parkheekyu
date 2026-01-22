
import React from 'react';
import { MOCK_EBOOKS } from '../constants';

interface MyEbooksProps {
  onBack: () => void;
}

const MyEbooks: React.FC<MyEbooksProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-sm font-bold text-gray-500 hover:text-brand-primary flex items-center">
            <span className="mr-2">←</span> 메인으로
          </button>
          <h2 className="text-xl font-black text-brand-dark tracking-tight italic">내 서재 <span className="text-brand-primary">LIBRARY</span></h2>
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-2xl mb-4">👑</div>
              <h3 className="text-lg font-black text-brand-dark mb-1">골드 멤버님</h3>
              <p className="text-xs font-bold text-gray-400 mb-6 tracking-tight uppercase">Nomad Explorer</p>
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">보유 포인트</span>
                  <span className="text-brand-primary">2,400P</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">보유 전자책</span>
                  <span className="text-brand-dark">3권</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ebook List */}
          <div className="col-span-1 md:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-black text-brand-dark tracking-tight">보유 중인 전자책</h4>
              <span className="text-xs font-bold text-gray-400">구매한 모든 콘텐츠는 평생 소장 가능합니다.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_EBOOKS.slice(0, 3).map((book) => (
                <div key={book.id} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm group hover:shadow-xl hover:border-brand-primary/20 transition-all">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-gray-50 relative">
                    <img src={book.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                  </div>
                  <h5 className="font-bold text-brand-dark text-sm mb-3 line-clamp-2 h-10 leading-snug">{book.title}</h5>
                  <div className="flex items-center justify-between mb-5 px-1">
                    <div className="text-[10px] font-black text-brand-primary bg-brand-accent px-2 py-0.5 rounded">구매완료</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF FILE</div>
                  </div>
                  <button className="w-full bg-brand-primary text-white py-4 rounded-xl text-xs font-black hover:bg-brand-secondary transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>PDF 다운로드</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyEbooks;
