
import React, { useState } from 'react';
import { EbookItem } from '../types';

interface CheckoutProps {
  product: EbookItem;
  onBack: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ product, onBack, onComplete }) => {
  const [step, setStep] = useState(1);

  const handlePay = () => {
    setStep(2);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-3xl mb-8 animate-bounce">💸</div>
        <h2 className="text-3xl font-black text-brand-dark mb-4 tracking-tighter">결제 처리 중입니다...</h2>
        <p className="text-brand-gray font-medium">잠시만 기다려주시면 내 서재로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-sm font-bold text-gray-500">← 뒤로가기</button>
          <h2 className="text-lg font-black text-brand-dark tracking-tight italic">주문/결제</h2>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-brand-dark mb-6">주문 상품 정보</h3>
              <div className="flex space-x-6">
                <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                  <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="text-brand-primary font-black text-[10px] uppercase mb-1">{product.category}</div>
                  <h4 className="font-bold text-brand-dark text-base mb-2 line-clamp-1">{product.title}</h4>
                  <div className="text-xs text-gray-400 font-bold">작가: {product.authorName} | {product.pageCount}P</div>
                  <div className="mt-4 text-xl font-black text-brand-dark">{product.price.toLocaleString()}원</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-brand-dark mb-6">결제 수단</h3>
              <div className="grid grid-cols-2 gap-4">
                {['신용/체크카드', '카카오페이', '네이버페이', '무통장입금'].map((method) => (
                  <button key={method} className="py-4 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-accent/50 transition-all">
                    {method}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-brand-dark text-white rounded-[2rem] p-8 shadow-2xl">
              <h3 className="text-lg font-black mb-8 border-b border-white/10 pb-4">최종 결제 금액</h3>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm font-bold text-white/60">
                  <span>상품 금액</span>
                  <span>{product.price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white/60">
                  <span>할인 금액</span>
                  <span>-0원</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                  <span>총 결제 금액</span>
                  <span className="text-brand-primary">{product.price.toLocaleString()}원</span>
                </div>
              </div>
              <button 
                onClick={handlePay}
                className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20"
              >
                결제하기
              </button>
              <p className="text-center text-[10px] text-white/40 font-bold mt-4">디하클전자책 이용약관 및 결제에 동의함으로 간주합니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
