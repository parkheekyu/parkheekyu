
import React from 'react';

interface SignupProps {
  onBack: () => void;
  onGoLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBack, onGoLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left side: Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071823942-169c03e35824?auto=format&fit=crop&q=80&w=1200&h=1600" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary via-brand-primary/90 to-brand-primary"></div>
        </div>

        <div className="relative z-10">
          <div 
            onClick={onBack}
            className="flex items-center space-x-2 cursor-pointer text-white/80 hover:text-white transition-colors mb-20 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-bold text-sm uppercase tracking-widest">Back to Store</span>
          </div>
          
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-8">
            지식을 자산으로<br />
            바꾸는 첫 걸음
          </h2>
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-md">
            단 1분 만에 회원가입하고<br />
            당신만의 디지털 수익 자동화를 구축하세요.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-yellow-400 text-xs">★</span>
            ))}
            <span className="text-white text-xs font-bold ml-2">4.9/5.0</span>
          </div>
          <p className="text-white font-bold mb-4 italic">"작가로 등록한 지 일주일 만에 첫 판매가 일어났습니다. 시스템이 정말 직관적이에요."</p>
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              alt="Author"
            />
            <div>
              <div className="text-white text-sm font-black">하이클래스 제이</div>
              <div className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Power Author</div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-brand-secondary/40 rounded-full blur-[120px]"></div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto py-8">
          <div className="flex items-center space-x-2 mb-10 lg:hidden" onClick={onBack}>
            <span className="text-brand-primary font-bold">← 메인으로</span>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2">새로운 시작</h3>
            <p className="text-brand-gray font-medium">디하클전자책의 멤버가 되어 성장을 시작하세요.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="성함을 입력해주세요"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-brand-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="example@nomad.com"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-brand-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="8자 이상 입력해주세요"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-brand-dark"
              />
            </div>
            
            <div className="pt-4 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-brand-dark transition-colors">
                  [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
                </span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-brand-dark transition-colors">
                  [선택] 마케팅 정보 수신 및 혜택 알림에 동의합니다.
                </span>
              </label>
            </div>

            <button className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 mt-6">
              회원가입 완료하기
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Or Sign up with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-3 py-4 bg-[#FEE500] rounded-2xl hover:bg-[#FDD835] transition-all font-bold text-sm text-[#3C1E1E]">
                <span className="text-xs">🟡</span>
                <span>Kakao</span>
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-sm font-bold text-gray-400">
            이미 계정이 있으신가요? <button onClick={onGoLogin} className="text-brand-primary hover:underline">로그인 하기</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
