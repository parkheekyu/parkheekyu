
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface HeroProps {
  onStore: () => void;
}

const ORIGINAL_SLIDES = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 7, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600&h=600' },
  { id: 8, imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600&h=600' },
];

const SLIDES = [
  ORIGINAL_SLIDES[ORIGINAL_SLIDES.length - 1],
  ...ORIGINAL_SLIDES,
  ORIGINAL_SLIDES[0],
];

const Hero: React.FC<HeroProps> = ({ onStore }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInfiniteLoop = useCallback(() => {
    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(ORIGINAL_SLIDES.length);
    } else if (currentSlide === SLIDES.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentSlide((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) return;
    setCurrentSlide((prev) => prev - 1);
  }, [isTransitioning]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextSlide, 5000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

  const slideUnit = isMobile ? 88 : 72;
  const offset = isMobile ? 6 : 15; 
  const transformX = `calc(${offset}vw - ${currentSlide * slideUnit}vw)`;

  const displayIndex = currentSlide === 0 
    ? ORIGINAL_SLIDES.length 
    : currentSlide === SLIDES.length - 1 
      ? 1 
      : currentSlide;

  return (
    <div className="bg-white pt-4 pb-6 overflow-hidden select-none">
      <div className="relative w-full">
        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.2,1)]' : ''}`}
          onTransitionEnd={handleInfiniteLoop}
          style={{ 
            transform: `translateX(${transformX})`,
            gap: isMobile ? '3vw' : '2vw'
          }}
        >
          {SLIDES.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={`relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-700 cursor-pointer ${
                index === currentSlide 
                  ? 'scale-100 opacity-100' 
                  : 'scale-[0.96] opacity-40 brightness-[0.85]'
              }`}
              style={{ 
                width: isMobile ? '85vw' : '70vw',
                height: isMobile ? '220px' : '360px'
              }}
              onClick={onStore}
            >
              <img 
                src={slide.imageUrl} 
                alt={`Banner ${slide.id}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div 
          className="absolute bottom-6 z-20 flex items-center bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-white border border-white/10 shadow-lg transition-all duration-300"
          style={{ right: isMobile ? '10vw' : '18vw' }}
        >
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:scale-110 transition-transform active:scale-95 focus:outline-none"
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <div className="flex items-center mx-4 text-[11px] font-bold tracking-tighter">
            <span className="text-white w-4 text-center">{displayIndex}</span>
            <span className="text-white/30 mx-1">/</span>
            <span className="text-white/30 w-4 text-center">{ORIGINAL_SLIDES.length}</span>
          </div>

          <div className="flex items-center space-x-3 border-l border-white/20 pl-4 ml-1">
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
              className="p-1 hover:text-brand-primary transition-colors focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
              className="p-1 hover:text-brand-primary transition-colors focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
