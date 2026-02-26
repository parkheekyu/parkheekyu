
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EbookCard from './components/ClassCard';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductDetail from './components/ProductDetail';
import MyEbooks from './components/MyEbooks';
import CreatorStudio from './components/CreatorStudio';
import Checkout from './components/Checkout';
import EbookStore from './components/EbookStore';
import JumpGame from './components/JumpGame';
import { CATEGORIES, MOCK_EBOOKS } from './constants';
import { EbookItem } from './types';

export type Page = 'home' | 'login' | 'signup' | 'detail' | 'my' | 'studio' | 'checkout' | 'store' | 'guide' | 'game';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [previousPage, setPreviousPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<EbookItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEbooks = useMemo(() => {
    let list = MOCK_EBOOKS;
    if (selectedCategory !== 'all') {
      const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name;
      list = list.filter(c => c.category === categoryName);
    }
    if (searchQuery) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const navigateTo = (page: Page, product?: EbookItem) => {
    if (product) setSelectedProduct(product);
    setPreviousPage(currentPage);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 'store') {
      setCurrentPage('store');
    }
  };

  if (currentPage === 'login') return <Login onBack={() => navigateTo('home')} onGoSignup={() => navigateTo('signup')} />;
  if (currentPage === 'signup') return <Signup onBack={() => navigateTo('home')} onGoLogin={() => navigateTo('login')} />;
  if (currentPage === 'detail' && selectedProduct) 
    return <ProductDetail product={selectedProduct} onBack={() => navigateTo(previousPage === 'store' ? 'store' : 'home')} onBuy={() => navigateTo('checkout')} />;
  if (currentPage === 'my') return <MyEbooks onBack={() => navigateTo('home')} />;
  if (currentPage === 'studio') return <CreatorStudio onBack={() => navigateTo('home')} />;
  if (currentPage === 'checkout' && selectedProduct) 
    return <Checkout product={selectedProduct} onBack={() => navigateTo('detail')} onComplete={() => navigateTo('my')} />;
  if (currentPage === 'store')
    return (
      <EbookStore
        onBack={() => navigateTo('home')}
        onDetail={(item) => navigateTo('detail', item)}
        initialCategory={selectedCategory}
      />
    );
  if (currentPage === 'game') return <JumpGame onBack={() => navigateTo('home')} />;

  return (
    <div className="min-h-screen bg-white pb-0 text-gray-900 text-[1.01rem]">
      <Header 
        onNavigate={navigateTo} 
        onSearch={handleSearch}
      />
      
      <main>
        <Hero onStore={() => navigateTo('store')} />
        
        <div className="max-w-7xl mx-auto px-4 mt-12">
          {/* 카테고리 필터 */}
          <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto pb-8 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-6 py-3 rounded-full transition-all border ${
                  selectedCategory === cat.id 
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-primary hover:text-brand-primary'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-[15px] font-bold whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* 메인 리스트 */}
          <section className="mt-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark tracking-tight leading-none">
                  {selectedCategory === 'all' ? '추천 전자책' : `${CATEGORIES.find(c => c.id === selectedCategory)?.name} 인기 도서`}
                </h2>
                <p className="text-sm md:text-base text-gray-400 font-medium mt-2">전문가들이 직접 집필한 하이클래스 지식 콘텐츠</p>
              </div>
              <button 
                onClick={() => navigateTo('store')}
                className="text-base font-bold text-brand-primary hover:underline underline-offset-4 transition-all"
              >
                전체보기 →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 md:gap-x-7 gap-y-12 md:gap-y-16 mb-24">
              {filteredEbooks.slice(0, 12).map((item) => (
                <div key={item.id} onClick={() => navigateTo('detail', item)}>
                  <EbookCard item={item} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 월부 스타일 수강생 후기 섹션 */}
        <section className="bg-[#F3F5F7] py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* 왼쪽 타이틀 영역 */}
              <div className="lg:w-1/4">
                <h2 className="text-2xl font-black text-[#1A1D23] mb-4 tracking-tighter leading-tight">
                  디하클 수강생 후기
                </h2>
                <p className="text-[15px] text-gray-500 font-medium mb-10 leading-relaxed">
                  나도 할 수 있을까 고민이 된다면<br />
                  수강생들의 성공 경험을 들어보세요.
                </p>
                <div className="flex space-x-2.5">
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm hover:text-brand-primary transition-all active:scale-95">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm hover:text-brand-primary transition-all active:scale-95">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              {/* 오른쪽 카드 리스트 */}
              <div className="lg:w-3/4 flex space-x-5 overflow-x-auto no-scrollbar pb-6">
                {[
                  { 
                    title: '카드값 200만원에서\n저축 200만원이 되기까지', 
                    content: '매달 무언가 사치를 부리는 것도 아니고 2만원..3만원.. 쓴지도 모르게 나간 돈들이 많았어요. 뭔가 잘못됐다는건 알았지만 고쳐야겠다는 생각은 하지 못했습니...', 
                    user: '성공한알밤님', 
                    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' 
                  },
                  { 
                    title: '재테크기초반 듣기 전\n돈 버리는 짓일까 망설였어요', 
                    content: '근데 강의를 듣자마자 좀 충격이었어요. 어떻게 어디서부터 바로잡아야 할지 갈피를 못 잡고 있는 저에게 재테크 기초반의 방법은 단순한 방법으로 절 다시...', 
                    user: '수리뷩이님', 
                    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100' 
                  },
                  { 
                    title: '유튜브만 보다가\n어쩌다 강의까지 수강했습니다', 
                    content: '재테크기초반을 듣기 전 사실 엄청난 기대도 없었고, 들어보고 몇가지만 적용하고 말아야지하는 얄팍한 의지로 시작했습니다. 그치만 보면 볼수록 "이것까지...', 
                    user: '담씩님', 
                    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100' 
                  }
                ].map((rev, i) => (
                  <div key={i} className="flex-shrink-0 w-[310px] bg-white rounded-xl p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-[330px] border border-transparent hover:border-brand-primary/10">
                    <div>
                      <h3 className="text-[18px] font-black text-brand-dark mb-4 whitespace-pre-line leading-tight tracking-tight">
                        {rev.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 font-medium leading-relaxed line-clamp-4">
                        {rev.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                      <div className="flex items-center space-x-3">
                        <img src={rev.img} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt={rev.user} />
                        <div>
                          <div className="text-[14px] font-bold text-gray-700 leading-tight">{rev.user}</div>
                          <div className="flex items-center text-brand-primary text-[12px] font-black mt-0.5">
                            <span className="text-yellow-400 mr-1">★</span> 5.0
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* '디하클이 처음이라면' 가이드 배너 섹션 */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div 
              className="relative rounded-2xl md:rounded-[2rem] overflow-hidden bg-black aspect-[4/1.2] md:aspect-[5/1] cursor-pointer group hover:shadow-2xl transition-all duration-500"
              onClick={() => navigateTo('store')}
            >
              {/* 배경 이미지 */}
              <img 
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600&h=400" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
                alt="Guide Background"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
              
              {/* 텍스트 영역: justify-center로 중앙 배치 보장 */}
              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10">
                <div className="pt-2"> {/* 상단에 치우쳐 보이는 것을 방지하기 위한 미세 조정 패딩 */}
                  <h3 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-5 tracking-tighter">
                    디하클이 처음이라면
                  </h3>
                  <div className="flex items-center text-brand-primary font-black text-sm md:text-lg group-hover:translate-x-2 transition-transform duration-300">
                    <span>더 알아보기</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 (242424) */}
      <footer className="bg-[#242424] py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <h1 className="text-2xl font-black text-brand-primary mb-8 tracking-tighter">DIHAKLE EBOOK</h1>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0 font-medium opacity-80">
                디지털 노마드의 성장을 돕는 프리미엄 지식 마켓플레이스.<br />
                당신의 소중한 경험이 누군가에게는 가장 큰 힘이 됩니다.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white text-[13px] mb-8 uppercase tracking-[0.2em] opacity-50">Support</h4>
              <ul className="text-sm text-gray-500 space-y-5 font-medium">
                <li><button className="hover:text-white transition-colors">FAQ</button></li>
                <li><button className="hover:text-white transition-colors">1:1 문의하기</button></li>
                <li><button className="hover:text-white transition-colors">작가 등록 가이드</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-[13px] mb-8 uppercase tracking-[0.2em] opacity-50">Legal</h4>
              <ul className="text-sm text-gray-500 space-y-5 font-medium">
                <li><button className="hover:text-white transition-colors">이용약관</button></li>
                <li><button className="hover:text-white transition-colors font-bold text-gray-300">개인정보 처리방침</button></li>
                <li><button className="hover:text-white transition-colors">환불 정책</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-white/5 text-center md:text-left">
            <p className="text-[11px] text-gray-600 font-bold uppercase tracking-[0.3em]">
              © 2024 DIHAKLE EBOOK. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
