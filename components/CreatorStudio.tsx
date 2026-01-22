
import React from 'react';

interface CreatorStudioProps {
  onBack: () => void;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <header className="bg-brand-dark py-6 px-4 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={onBack} className="text-white/60 hover:text-white font-bold text-sm">← Exit</button>
            <h1 className="text-xl font-black italic tracking-tighter">STUDIO<span className="text-brand-primary">.D</span></h1>
          </div>
          <button className="bg-brand-primary text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg shadow-brand-primary/20">신규 전자책 등록</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: '누적 수익', value: '12,450,000원', color: 'text-brand-primary' },
            { label: '이번 달 예상 정산액', value: '2,840,000원', color: 'text-brand-dark' },
            { label: '판매 건수', value: '542건', color: 'text-brand-dark' },
            { label: '평균 평점', value: '4.9 / 5.0', color: 'text-yellow-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{stat.label}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-brand-dark mb-8 tracking-tight">최근 7일 판매 추이</h3>
            <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-gray-100">
              {[40, 65, 30, 85, 95, 70, 100].map((h, i) => (
                <div key={i} className="w-12 bg-brand-primary/10 rounded-t-xl relative group cursor-pointer hover:bg-brand-primary transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.floor(Math.random() * 20 + 10)}건
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-gray-400">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-brand-dark mb-8 tracking-tight">작가 팁</h3>
            <div className="space-y-6">
              <div className="p-5 bg-brand-accent rounded-2xl">
                <div className="text-brand-primary font-black text-xs mb-2">HOT TREND</div>
                <p className="text-sm font-bold text-brand-dark leading-relaxed">최근 '무자본 부업' 키워드의 조회수가 40% 상승했습니다. 관련 주제를 준비해보세요!</p>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl">
                <div className="text-gray-400 font-black text-xs mb-2">NEW GUIDE</div>
                <p className="text-sm font-bold text-brand-dark leading-relaxed">매력적인 표지 디자인이 구매율을 2배 높입니다. 가이드를 확인하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorStudio;
