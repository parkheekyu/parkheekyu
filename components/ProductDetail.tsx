
import React, { useState } from 'react';
import { EbookItem } from '../types';

interface ProductDetailProps {
  product: EbookItem;
  onBack: () => void;
  onBuy: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onBuy }) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(6687);
  
  // 옵션 선택 상태
  const [selectedOption, setSelectedOption] = useState(0);

  const options = [
    {
      id: 0,
      title: `[한정 수량] ${product.title} + 프리미엄 코칭`,
      price: product.price,
      description: 'PDF 전자책 + 1:1 라이브 코칭 + 작가 피드백 + 전용 단톡방',
      isLimited: true
    },
    {
      id: 1,
      title: `${product.title} 베이직 플랜`,
      price: Math.floor(product.price * 0.85),
      description: 'PDF 전자책 전용 (평생 소장 & 업데이트 포함)',
      isLimited: false
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 가상의 리뷰 데이터
  const [reviews, setReviews] = useState([
    { id: 1, user: '노마드킴', rating: 5, date: '2024.03.15', content: '진짜 실전에서 바로 쓸 수 있는 꿀팁들만 모아놨네요. 돈이 전혀 아깝지 않습니다!' },
    { id: 2, user: '디지털러버', rating: 4, date: '2024.03.10', content: '내용이 아주 알찹니다. 특히 자동화 시스템 구축 부분이 인상 깊었어요.' },
    { id: 3, user: '성장하는개발자', rating: 5, date: '2024.03.02', content: '비전공자인데도 이해하기 쉽게 설명되어 있어서 좋았습니다. 강추합니다.' },
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        user: '방문자',
        rating: rating,
        date: new Date().toLocaleDateString().replace(/\. /g, '.').replace(/\.$/, ''),
        content: reviewContent,
      };
      setReviews([newReview, ...reviews]);
      setReviewContent('');
      setRating(5);
      setIsReviewFormOpen(false);
      setIsSubmitting(false);
    }, 800);
  };

  const discountRate = 38;
  const originalPrice = Math.floor(options[selectedOption].price / (1 - discountRate / 100));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors">
            <span className="mr-2">←</span> 뒤로가기
          </button>
          <div className="flex items-center space-x-4">
             <button className="text-gray-400 hover:text-brand-dark transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12">
        {/* Left: Content Area */}
        <div className="flex-1">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-brand-dark mb-4 leading-tight tracking-tight">
              [2026년 New] {product.title} - {product.category} 상위 1%로 가는 지름길!
            </h2>
            <div className="flex items-center space-x-2 text-sm font-bold">
              <div className="flex text-yellow-400 text-lg">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}>{s}</span>
                ))}
              </div>
              <span className="text-brand-dark text-base">{product.rating}</span>
              <button className="text-brand-primary underline decoration-brand-primary/30 underline-offset-2 ml-1">
                {product.reviewCount.toLocaleString()}개 후기
              </button>
            </div>
          </div>

          <div className="space-y-16">
            {/* Thumbnail Image Section (Changed to 16:9 aspect ratio as requested) */}
            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-black/5 mb-10 aspect-[16/9] relative bg-gray-50 w-full">
              <img 
                src={product.imageUrl} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt={product.title} 
              />
            </div>

            {/* Author Introduction (Renamed from Knowledge Introduction) */}
            <section>
              <h3 className="text-xl font-black text-brand-dark mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-brand-primary rounded-full mr-3"></span>
                작가 소개
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-brand-gray leading-loose font-medium text-base md:text-lg">
                  안녕하세요, {product.authorName}입니다. 저는 단순히 이론을 나열하는 것이 아니라, 실제 현장에서 수백 번의 시행착오 끝에 얻은 '진짜 기술'을 전달하는 것을 사명으로 합니다. 
                  {product.pageCount}페이지의 방대한 분량에는 누구나 따라 할 수 있는 단계별 프로세스가 포함되어 있습니다.
                  <br /><br />
                  이미 수많은 분들이 저의 방법론을 통해 자신만의 수익 모델을 구축했으며, 당신도 이 로드맵을 따라간다면 디지털 노마드로의 비상을 성공적으로 시작할 수 있습니다.
                </p>
              </div>
            </section>

            {/* Table of Contents (Renamed from Detailed Curriculum) */}
            <section>
              <h3 className="text-xl font-black text-brand-dark mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-brand-primary rounded-full mr-3"></span>
                목차
              </h3>
              <div className="grid gap-3">
                {['프롤로그: 왜 지금 이 기술이 필요한가', '제1장: 마인드셋과 도구 준비하기', '제2장: 0원에서 100만원을 만드는 핵심 알고리즘', '제3장: 지속 가능한 수익을 위한 자동화 시스템', '에필로그: 당신의 항해를 응원하며'].map((chapter, i) => (
                  <div key={i} className="flex items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-brand-primary/30 hover:bg-white hover:shadow-md transition-all">
                    <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-xs font-black text-brand-primary mr-4 shadow-sm group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">{i + 1}</span>
                    <span className="text-sm md:text-base font-bold text-brand-dark">{chapter}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-brand-dark flex items-center">
                  <span className="w-1.5 h-6 bg-brand-primary rounded-full mr-3"></span>
                  수강생 리뷰
                </h3>
                <button 
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="text-sm font-bold text-brand-primary cursor-pointer hover:underline underline-offset-4"
                >
                  {isReviewFormOpen ? '작성 취소' : '리뷰 작성하기'}
                </button>
              </div>

              {isReviewFormOpen && (
                <div className="mb-10 p-8 bg-gray-50 rounded-[2rem] border border-brand-primary/20 shadow-sm">
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-6">
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-3">별점 선택</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-3">상세 리뷰</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="이 전자책이 당신의 성장에 어떻게 도움이 되었나요? 솔직한 후기를 남겨주세요."
                        className="w-full bg-white border-2 border-transparent focus:border-brand-primary/20 rounded-2xl px-6 py-4 min-h-[120px] outline-none transition-all font-medium text-brand-dark text-sm"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-brand-primary text-white px-10 py-3.5 rounded-xl font-black text-sm shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? '제출 중...' : '리뷰 등록하기'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Summary Rating */}
              <div className="bg-brand-accent/30 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-brand-dark mb-1">{product.rating}</div>
                  <div className="flex text-yellow-400 text-lg mb-1 justify-center">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="h-px w-20 md:h-12 md:w-px bg-brand-primary/10"></div>
                <div className="flex-1 max-w-xs w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center space-x-3">
                      <span className="text-[10px] font-black text-gray-400 w-4">{star}점</span>
                      <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-3xl border border-gray-100 hover:border-brand-primary/20 hover:shadow-sm transition-all bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                          {review.user[0]}
                        </div>
                        <div>
                          <div className="text-sm font-black text-brand-dark">{review.user}</div>
                          <div className="flex text-yellow-400 text-[10px]">
                            {'★★★★★'.split('').map((s, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">{review.date}</span>
                    </div>
                    <p className="text-sm text-brand-gray font-medium leading-relaxed pl-1">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right: Redesigned Purchase Box based on image */}
        <div className="lg:w-[420px]">
          <div className="sticky top-24 border border-gray-100 rounded-3xl p-6 bg-white shadow-2xl shadow-brand-primary/5 ring-1 ring-black/5">
            {/* Price Header */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-red-500">{discountRate}%</span>
                <span className="text-lg text-gray-300 line-through font-bold">{originalPrice.toLocaleString()}원</span>
              </div>
              <div className="text-4xl font-black text-brand-dark tracking-tight mt-1">
                {options[selectedOption].price.toLocaleString()}원
              </div>
            </div>

            {/* Selection Title */}
            <div className="mb-4">
               <h4 className="text-xl font-black text-brand-dark">수강 옵션</h4>
            </div>

            {/* Options Cards */}
            <div className="space-y-3 mb-8">
              {options.map((option, idx) => (
                <div 
                  key={option.id}
                  onClick={() => setSelectedOption(idx)}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative ${
                    selectedOption === idx 
                      ? 'border-brand-primary bg-brand-accent/30 ring-4 ring-brand-primary/5' 
                      : 'border-gray-100 bg-white hover:border-brand-primary/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h5 className={`font-black text-[16px] leading-tight mb-1 ${selectedOption === idx ? 'text-brand-dark' : 'text-gray-600'}`}>
                        {option.title}
                      </h5>
                      <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <div className={`text-[17px] font-black ml-4 ${selectedOption === idx ? 'text-brand-dark' : 'text-gray-400'}`}>
                      {option.price.toLocaleString()}원
                    </div>
                  </div>
                  {option.isLimited && (
                    <div className="mt-2">
                       <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Limited Edition</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Footer Summary */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-6">
               <span className="text-base font-black text-brand-dark">상품 금액</span>
               <span className="text-2xl font-black text-brand-dark">{options[selectedOption].price.toLocaleString()}원</span>
            </div>

            {/* Action Bar */}
            <div className="flex items-stretch gap-3">
              <button 
                onClick={handleLike}
                className="flex flex-col items-center justify-center border-2 border-gray-100 rounded-2xl px-4 py-2 hover:bg-gray-50 transition-all active:scale-95 group"
              >
                <svg 
                  className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 stroke-red-500' : 'stroke-gray-300 group-hover:stroke-gray-400'}`} 
                  fill={isLiked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[11px] font-black text-gray-400 mt-1">{likeCount.toLocaleString()}</span>
              </button>
              
              <button 
                onClick={onBuy}
                className="flex-1 bg-brand-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary hover:-translate-y-1 transition-all active:translate-y-0"
              >
                지금 바로 구매하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
