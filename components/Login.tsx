
import React from 'react';

interface LoginProps {
  onBack: () => void;
  onGoSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onGoSignup }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left side: Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=1600" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary"></div>
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
            다시, 당신의<br />
            비상을 시작할 시간
          </h2>
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-md">
            디하클전자책은 상위 1% 노마드들을 위한<br />
            검증된 지식의 성지입니다.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <p className="text-white font-bold mb-4 italic">"이곳에서 배운 제휴마케팅 전략 덕분에 퇴사 후 첫 달 수익 500만원을 달성했습니다."</p>
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              alt="User"
            />
            <div>
              <div className="text-white text-sm font-black">노마드 앤드류</div>
              <div className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Verified Member</div>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-secondary/30 rounded-full blur-[100px]"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center space-x-2 mb-10 lg:hidden" onClick={onBack}>
            <span className="text-brand-primary font-bold">← 메인으로</span>
          </div>

          <div className="mb-12">
            <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2">라운지 입장</h3>
            <p className="text-brand-gray font-medium">서비스 이용을 위해 로그인이 필요합니다.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-brand-dark"
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <span className="text-xs font-bold text-gray-500">로그인 유지</span>
              </label>
              <button className="text-xs font-bold text-brand-primary hover:underline">비밀번호 찾기</button>
            </div>

            <button className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-brand-dark/10 mt-4">
              로그인하기
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Social Entry</span>
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
            아직 멤버가 아니신가요? <button onClick={onGoSignup} className="text-brand-primary hover:underline">회원가입 하기</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
