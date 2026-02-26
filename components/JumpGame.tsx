
import React, { useEffect, useRef, useCallback } from 'react';

// --- Game Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 255;
const PLAYER_X = 80;
const PLAYER_W = 36;
const PLAYER_H = 44;
const JUMP_FORCE = -14;
const GRAVITY = 0.65;
const OBS_MIN_H = 35;
const OBS_MAX_H = 75;
const OBS_W = 22;

interface Obstacle {
  x: number;
  h: number;
}

interface Cloud {
  x: number;
  y: number;
  w: number;
}

interface GameState {
  playerY: number;
  velY: number;
  isJumping: boolean;
  obstacles: Obstacle[];
  clouds: Cloud[];
  score: number;
  speed: number;
  frame: number;
  gameOver: boolean;
  started: boolean;
  groundX: number;
}

interface JumpGameProps {
  onBack: () => void;
}

const JumpGame: React.FC<JumpGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const stateRef = useRef<GameState>(makeInitialState());

  function makeInitialState(): GameState {
    return {
      playerY: GROUND_Y - PLAYER_H,
      velY: 0,
      isJumping: false,
      obstacles: [],
      clouds: [
        { x: 200, y: 40, w: 80 },
        { x: 480, y: 60, w: 60 },
        { x: 680, y: 30, w: 100 },
      ],
      score: 0,
      speed: 5,
      frame: 0,
      gameOver: false,
      started: false,
      groundX: 0,
    };
  }

  const doJump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    if (!s.started) s.started = true;
    if (!s.isJumping) {
      s.velY = JUMP_FORCE;
      s.isJumping = true;
    }
  }, []);

  const doRestart = useCallback(() => {
    stateRef.current = makeInitialState();
  }, []);

  const handleAction = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) doRestart();
    else doJump();
  }, [doJump, doRestart]);

  // Draw a rounded rectangle helper
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
    const h = w * 0.45;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.6, w * 0.28, h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.55, y + h * 0.4, w * 0.32, h * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.78, y + h * 0.6, w * 0.24, h * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCactus(ctx: CanvasRenderingContext2D, x: number, h: number) {
    const trunk = OBS_W;
    const armW = 10;
    const armH = 18;
    const armY = GROUND_Y - h + h * 0.35;

    ctx.fillStyle = '#2d7a22';
    // trunk
    ctx.fillRect(x, GROUND_Y - h, trunk, h);
    // left arm
    ctx.fillRect(x - armW, armY, armW, armH);
    ctx.fillRect(x - armW, armY - armH * 0.5, armW, armH * 0.5 + 4);
    // right arm
    const rx = x + trunk;
    const ry = GROUND_Y - h + h * 0.5;
    ctx.fillRect(rx, ry, armW, armH);
    ctx.fillRect(rx, ry - armH * 0.35, armW, armH * 0.35 + 4);

    // dark outline edges
    ctx.fillStyle = '#1d5217';
    ctx.fillRect(x, GROUND_Y - h, 3, h);
    ctx.fillRect(x + trunk - 3, GROUND_Y - h, 3, h);
  }

  function drawCharacter(ctx: CanvasRenderingContext2D, py: number, frame: number, isRunning: boolean) {
    const x = PLAYER_X;
    const y = py;
    const W = PLAYER_W;
    const H = PLAYER_H;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + W / 2, GROUND_Y + 4, W * 0.45, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#FF6B35';
    roundRect(ctx, x, y, W, H * 0.72, 8);
    ctx.fill();

    // Head
    ctx.fillStyle = '#FF8C5A';
    roundRect(ctx, x + 3, y - 14, W - 6, 20, 7);
    ctx.fill();

    // Eye white
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + W - 10, y - 7, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#1A1D23';
    ctx.beginPath();
    ctx.ellipse(x + W - 8, y - 6, 3, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth smile
    ctx.strokeStyle = '#CC4411';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + W - 10, y - 1, 4, 0, Math.PI);
    ctx.stroke();

    // Legs animation
    const legSwing = isRunning ? Math.sin(frame * 0.35) * 6 : 0;
    const legBase = y + H * 0.72;
    ctx.fillStyle = '#CC5525';
    roundRect(ctx, x + 4, legBase + legSwing, 10, 12, 3);
    ctx.fill();
    roundRect(ctx, x + W - 14, legBase - legSwing, 10, 12, 3);
    ctx.fill();

    // Arm
    const armSwing = isRunning ? Math.sin(frame * 0.35 + Math.PI) * 4 : 0;
    ctx.fillStyle = '#FF8C5A';
    roundRect(ctx, x - 6, y + 6 + armSwing, 8, 18, 3);
    ctx.fill();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        const s = stateRef.current;
        if (s.gameOver) doRestart();
        else doJump();
      }
    };
    window.addEventListener('keydown', onKey);

    const loop = () => {
      const s = stateRef.current;

      // --- Update ---
      if (s.started && !s.gameOver) {
        s.frame++;
        s.score++;
        s.speed = 5 + Math.floor(s.score / 400) * 0.5;

        // Physics
        s.velY += GRAVITY;
        s.playerY += s.velY;
        if (s.playerY >= GROUND_Y - PLAYER_H) {
          s.playerY = GROUND_Y - PLAYER_H;
          s.velY = 0;
          s.isJumping = false;
        }

        // Ground scroll
        s.groundX = (s.groundX - s.speed) % 40;

        // Clouds
        s.clouds.forEach(c => {
          c.x -= s.speed * 0.25;
          if (c.x + c.w < 0) c.x = CANVAS_WIDTH + 20;
        });

        // Spawn obstacles
        const interval = Math.max(55, 95 - Math.floor(s.score / 300));
        if (s.frame % interval === 0) {
          const h = OBS_MIN_H + Math.random() * (OBS_MAX_H - OBS_MIN_H);
          s.obstacles.push({ x: CANVAS_WIDTH + 10, h });
        }

        // Move obstacles
        s.obstacles = s.obstacles.filter(o => {
          o.x -= s.speed;
          return o.x + OBS_W + 15 > 0;
        });

        // Collision
        const px1 = PLAYER_X + 6;
        const px2 = PLAYER_X + PLAYER_W - 6;
        const py2 = s.playerY + PLAYER_H + PLAYER_H * 0.72 - 4;
        for (const o of s.obstacles) {
          if (px2 > o.x - 2 && px1 < o.x + OBS_W + 2 && py2 > GROUND_Y - o.h + 4) {
            s.gameOver = true;
          }
        }
      }

      // --- Draw ---
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      sky.addColorStop(0, '#87CEEB');
      sky.addColorStop(1, '#D4EDFF');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Clouds
      s.clouds.forEach(c => drawCloud(ctx, c.x, c.y, c.w));

      // Ground
      ctx.fillStyle = '#A0785A';
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 8);
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 3);

      // Scrolling ground dots
      ctx.fillStyle = '#8B6543';
      for (let gx = s.groundX; gx < CANVAS_WIDTH; gx += 40) {
        ctx.fillRect(gx, GROUND_Y + 14, 20, 2);
      }

      // Obstacles
      s.obstacles.forEach(o => drawCactus(ctx, o.x, o.h));

      // Player
      const isRunning = s.started && !s.isJumping;
      drawCharacter(ctx, s.playerY, s.frame, isRunning);

      // Score
      ctx.fillStyle = 'rgba(26,29,35,0.75)';
      ctx.font = 'bold 18px Pretendard, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`점수  ${s.score}`, CANVAS_WIDTH - 16, 32);

      // Speed badge
      const spd = Math.floor(s.speed * 10) / 10;
      ctx.font = '13px Pretendard, sans-serif';
      ctx.fillStyle = 'rgba(0,130,230,0.75)';
      ctx.fillText(`속도 x${spd}`, CANVAS_WIDTH - 16, 52);

      // Overlay: idle
      if (!s.started && !s.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.38)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 38px Pretendard, sans-serif';
        ctx.fillText('점프 게임', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 22);
        ctx.font = '18px Pretendard, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText('스페이스바 / 클릭 / 터치로 시작!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 16);
      }

      // Overlay: game over
      if (s.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.52)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 42px Pretendard, sans-serif';
        ctx.fillText('게임 오버!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 28);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Pretendard, sans-serif';
        ctx.fillText(`최종 점수: ${s.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 12);
        ctx.font = '16px Pretendard, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.fillText('스페이스바 / 클릭 / 터치로 재시작', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 46);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', onKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [doJump, doRestart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-brand-primary transition-colors font-bold text-sm"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
          <h1 className="text-xl font-black text-brand-dark tracking-tighter">
            미니 점프 게임
          </h1>
        </div>
      </header>

      {/* Game area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={handleAction}
              onTouchStart={(e) => { e.preventDefault(); handleAction(); }}
              className="block w-full cursor-pointer"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Controls hint */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-xs font-bold text-gray-600">Space</kbd>
              <span>또는</span>
              <kbd className="bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-xs font-bold text-gray-600">↑</kbd>
              점프
            </span>
            <span className="text-gray-200">|</span>
            <span>마우스 클릭 또는 화면 터치도 가능</span>
          </div>

          {/* Game rules */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { icon: '🌵', title: '장애물 피하기', desc: '선인장을 뛰어넘어요' },
              { icon: '⬆️', title: '점프로 회피', desc: '타이밍에 맞게 점프!' },
              { icon: '🚀', title: '점수 올리기', desc: '오래 살아남을수록 빨라져요' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-700 text-sm">{item.title}</div>
                <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JumpGame;
