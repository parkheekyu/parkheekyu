
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface GameState {
  isRunning: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isOnGround: boolean;
  jumpCount: number;
  frame: number;
  frameTimer: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 240;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const INITIAL_SPEED = 5;

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const { x, y, width, height, isOnGround, frame } = player;

  // 몸통
  ctx.fillStyle = '#0082E6';
  ctx.fillRect(x + 8, y + 10, 24, 22);

  // 머리
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x + 20, y + 8, 11, 0, Math.PI * 2);
  ctx.fill();

  // 눈
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.arc(x + 25, y + 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + 26, y + 5.5, 1, 0, Math.PI * 2);
  ctx.fill();

  // 입
  ctx.strokeStyle = '#1A1D23';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + 24, y + 11, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 다리 애니메이션
  ctx.fillStyle = '#0066B8';
  if (isOnGround) {
    const legOffset = Math.sin(frame * 0.3) * 6;
    // 왼쪽 다리
    ctx.fillRect(x + 10, y + 32, 7, 10 + legOffset);
    // 오른쪽 다리
    ctx.fillRect(x + 22, y + 32, 7, 10 - legOffset);
    // 신발
    ctx.fillStyle = '#1A1D23';
    ctx.fillRect(x + 8, y + 40 + legOffset, 11, 5);
    ctx.fillRect(x + 20, y + 40 - legOffset, 11, 5);
  } else {
    // 점프 중: 다리 접기
    ctx.fillRect(x + 10, y + 32, 7, 6);
    ctx.fillRect(x + 22, y + 32, 7, 6);
    ctx.fillStyle = '#1A1D23';
    ctx.fillRect(x + 8, y + 36, 11, 5);
    ctx.fillRect(x + 20, y + 36, 11, 5);
  }

  // 팔 애니메이션
  ctx.fillStyle = '#0082E6';
  if (isOnGround) {
    const armOffset = Math.sin(frame * 0.3) * 5;
    ctx.fillRect(x + 2, y + 14 + armOffset, 8, 5);
    ctx.fillRect(x + 30, y + 14 - armOffset, 8, 5);
  } else {
    ctx.fillRect(x + 2, y + 12, 8, 5);
    ctx.fillRect(x + 30, y + 12, 8, 5);
  }
}

function drawCactus(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const { x, y, width, height } = obs;
  ctx.fillStyle = '#2D8A4E';

  // 몸통
  ctx.fillRect(x + width / 2 - 5, y, 10, height);

  // 왼쪽 가지
  ctx.fillRect(x + 2, y + height * 0.3, width / 2 - 3, 8);
  ctx.fillRect(x + 2, y + height * 0.15, 8, height * 0.15 + 8);

  // 오른쪽 가지
  ctx.fillRect(x + width / 2 + 3, y + height * 0.4, width / 2 - 5, 8);
  ctx.fillRect(x + width - 10, y + height * 0.22, 8, height * 0.18 + 8);

  // 선인장 윤곽
  ctx.strokeStyle = '#1E6B38';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + width / 2 - 5, y, 10, height);
  ctx.strokeRect(x + 2, y + height * 0.3, width / 2 - 3, 8);
}

function drawBird(ctx: CanvasRenderingContext2D, obs: Obstacle, frame: number) {
  const { x, y } = obs;
  const wingUp = Math.sin(frame * 0.2) > 0;

  ctx.fillStyle = '#8B5CF6';

  // 몸통
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 10, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 날개
  ctx.fillStyle = '#7C3AED';
  if (wingUp) {
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 8);
    ctx.lineTo(x + 2, y - 8);
    ctx.lineTo(x + 20, y + 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 30, y + 8);
    ctx.lineTo(x + 38, y - 8);
    ctx.lineTo(x + 20, y + 4);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 8);
    ctx.lineTo(x + 2, y + 20);
    ctx.lineTo(x + 20, y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 30, y + 8);
    ctx.lineTo(x + 38, y + 20);
    ctx.lineTo(x + 20, y + 10);
    ctx.closePath();
    ctx.fill();
  }

  // 눈
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + 28, y + 7, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.arc(x + 29, y + 7, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 부리
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.moveTo(x + 34, y + 9);
  ctx.lineTo(x + 42, y + 10);
  ctx.lineTo(x + 34, y + 13);
  ctx.closePath();
  ctx.fill();
}

function drawGround(ctx: CanvasRenderingContext2D, offset: number) {
  // 땅
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, GROUND_Y + 5, CANVAS_WIDTH, 8);

  ctx.fillStyle = '#A0956B';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 6);

  // 지면 텍스처
  ctx.fillStyle = '#6B5B3E';
  for (let i = 0; i < 20; i++) {
    const gx = ((i * 50 - offset) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
    ctx.fillRect(gx, GROUND_Y + 2, 15, 2);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cloud.x, cloud.y, cloud.width * 0.3, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.width * 0.25, cloud.y - 6, cloud.width * 0.22, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.27, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, '#E6F4FF');
  gradient.addColorStop(0.7, '#C7E8FF');
  gradient.addColorStop(1, '#A8D5F0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function checkCollision(player: Player, obs: Obstacle): boolean {
  const margin = 6;
  return (
    player.x + margin < obs.x + obs.width - margin &&
    player.x + player.width - margin > obs.x + margin &&
    player.y + margin < obs.y + obs.height &&
    player.y + player.height - margin > obs.y
  );
}

interface JumpGameProps {
  onBack: () => void;
}

const JumpGame: React.FC<JumpGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    isRunning: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    speed: INITIAL_SPEED,
  });
  const playerRef = useRef<Player>({
    x: 80,
    y: GROUND_Y - 50,
    width: 40,
    height: 50,
    vy: 0,
    isOnGround: true,
    jumpCount: 0,
    frame: 0,
    frameTimer: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const cloudsRef = useRef<Cloud[]>([
    { x: 200, y: 60, width: 90, speed: 0.5 },
    { x: 500, y: 40, width: 70, speed: 0.4 },
    { x: 700, y: 80, width: 80, speed: 0.6 },
  ]);
  const groundOffsetRef = useRef(0);
  const frameCountRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const nextObstacleRef = useRef(120);
  const scoreTimerRef = useRef(0);

  const [displayState, setDisplayState] = useState({
    isRunning: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
  });

  const jump = useCallback(() => {
    const gs = gameStateRef.current;
    const player = playerRef.current;

    if (gs.isGameOver) {
      restart();
      return;
    }

    if (!gs.isRunning) {
      gs.isRunning = true;
      setDisplayState(prev => ({ ...prev, isRunning: true }));
    }

    if (player.jumpCount < 2) {
      player.vy = JUMP_FORCE;
      player.isOnGround = false;
      player.jumpCount++;
    }
  }, []);

  const restart = useCallback(() => {
    const gs = gameStateRef.current;
    const player = playerRef.current;

    gs.isRunning = true;
    gs.isGameOver = false;
    gs.score = 0;
    gs.speed = INITIAL_SPEED;

    player.x = 80;
    player.y = GROUND_Y - 50;
    player.vy = 0;
    player.isOnGround = true;
    player.jumpCount = 0;
    player.frame = 0;

    obstaclesRef.current = [];
    frameCountRef.current = 0;
    nextObstacleRef.current = 120;
    groundOffsetRef.current = 0;
    scoreTimerRef.current = 0;

    setDisplayState(prev => ({
      ...prev,
      isRunning: true,
      isGameOver: false,
      score: 0,
    }));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'KeyR' && gameStateRef.current.isGameOver) {
        restart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump, restart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      const gs = gameStateRef.current;
      const player = playerRef.current;

      // 배경
      drawBackground(ctx);

      // 구름
      cloudsRef.current.forEach(cloud => {
        if (gs.isRunning && !gs.isGameOver) {
          cloud.x -= cloud.speed;
          if (cloud.x + cloud.width < 0) {
            cloud.x = CANVAS_WIDTH + cloud.width;
            cloud.y = 30 + Math.random() * 80;
          }
        }
        drawCloud(ctx, cloud);
      });

      if (gs.isRunning && !gs.isGameOver) {
        frameCountRef.current++;
        const fc = frameCountRef.current;

        // 점수 증가
        scoreTimerRef.current++;
        if (scoreTimerRef.current >= 6) {
          gs.score++;
          scoreTimerRef.current = 0;
          setDisplayState(prev => ({ ...prev, score: gs.score }));
        }

        // 속도 증가
        gs.speed = INITIAL_SPEED + Math.floor(gs.score / 200) * 0.5;

        // 지면 오프셋
        groundOffsetRef.current = (groundOffsetRef.current + gs.speed) % CANVAS_WIDTH;

        // 플레이어 물리
        player.vy += GRAVITY;
        player.y += player.vy;

        if (player.y >= GROUND_Y - player.height) {
          player.y = GROUND_Y - player.height;
          player.vy = 0;
          player.isOnGround = true;
          player.jumpCount = 0;
        } else {
          player.isOnGround = false;
        }

        // 프레임 애니메이션
        player.frameTimer++;
        if (player.frameTimer > 4) {
          player.frame++;
          player.frameTimer = 0;
        }

        // 장애물 생성
        nextObstacleRef.current--;
        if (nextObstacleRef.current <= 0) {
          const isBird = gs.score > 100 && Math.random() < 0.35;
          const obs: Obstacle = isBird
            ? {
                x: CANVAS_WIDTH,
                y: GROUND_Y - 60 - Math.random() * 40,
                width: 42,
                height: 30,
                type: 'bird',
              }
            : {
                x: CANVAS_WIDTH,
                y: GROUND_Y - (30 + Math.random() * 30),
                width: 30 + Math.random() * 20,
                height: 30 + Math.random() * 30,
                type: 'cactus',
              };
          obstaclesRef.current.push(obs);
          nextObstacleRef.current = 80 + Math.random() * 100 - Math.floor(gs.score / 300) * 10;
          nextObstacleRef.current = Math.max(nextObstacleRef.current, 50);
        }

        // 장애물 이동 및 충돌
        obstaclesRef.current = obstaclesRef.current.filter(obs => {
          obs.x -= gs.speed;
          if (checkCollision(player, obs)) {
            gs.isGameOver = true;
            if (gs.score > gs.highScore) {
              gs.highScore = gs.score;
            }
            setDisplayState(prev => ({
              ...prev,
              isGameOver: true,
              score: gs.score,
              highScore: gs.highScore,
            }));
          }
          return obs.x + obs.width > 0;
        });
      }

      // 지면 그리기
      drawGround(ctx, groundOffsetRef.current);

      // 장애물 그리기
      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'cactus') {
          drawCactus(ctx, obs);
        } else {
          drawBird(ctx, obs, frameCountRef.current);
        }
      });

      // 플레이어 그리기
      drawPlayer(ctx, player);

      // 점수 표시
      ctx.fillStyle = 'rgba(26,29,35,0.7)';
      ctx.font = 'bold 20px Pretendard, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${gs.score}`, CANVAS_WIDTH - 20, 35);

      ctx.font = '14px Pretendard, sans-serif';
      ctx.fillStyle = 'rgba(100,116,139,0.8)';
      ctx.fillText(`최고: ${gs.highScore}`, CANVAS_WIDTH - 20, 55);

      // 시작 전 안내
      if (!gs.isRunning && !gs.isGameOver) {
        ctx.fillStyle = 'rgba(0,130,230,0.15)';
        ctx.beginPath();
        ctx.roundRect(CANVAS_WIDTH / 2 - 130, CANVAS_HEIGHT / 2 - 35, 260, 60, 16);
        ctx.fill();
        ctx.fillStyle = '#0082E6';
        ctx.font = 'bold 18px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('스페이스바 또는 탭 클릭으로 시작!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 8);
      }

      // 게임 오버
      if (gs.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(CANVAS_WIDTH / 2 - 160, CANVAS_HEIGHT / 2 - 70, 320, 140, 20);
        ctx.fill();

        ctx.fillStyle = '#1A1D23';
        ctx.font = 'bold 30px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('게임 오버!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25);

        ctx.font = '18px Pretendard, sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.fillText(`점수: ${gs.score}  |  최고: ${gs.highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

        ctx.fillStyle = '#0082E6';
        ctx.beginPath();
        ctx.roundRect(CANVAS_WIDTH / 2 - 70, CANVAS_HEIGHT / 2 + 28, 140, 38, 10);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Pretendard, sans-serif';
        ctx.fillText('다시 시작 (R)', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 52);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F5F7] flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-500 hover:text-brand-primary transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </button>
        <h1 className="text-xl font-black text-brand-dark tracking-tight">점프 게임</h1>
        <div className="w-24" />
      </div>

      {/* 게임 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="w-full max-w-3xl">
          {/* 게임 정보 */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-gray-500">조작법:</span>
              <span className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-600">SPACE</span>
              <span className="text-xs text-gray-400">/</span>
              <span className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs font-mono font-bold text-gray-600">↑</span>
              <span className="text-xs text-gray-400">/ 탭 터치</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-400">2단 점프 지원!</span>
            </div>
          </div>

          {/* 캔버스 */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 bg-white">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full block cursor-pointer"
              style={{ imageRendering: 'auto', touchAction: 'none' }}
              onClick={jump}
              onTouchStart={(e) => {
                e.preventDefault();
                jump();
              }}
            />
          </div>

          {/* 모바일 버튼 */}
          <div className="mt-4 flex justify-center gap-4 md:hidden">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                jump();
              }}
              onClick={jump}
              className="bg-brand-primary text-white font-black text-xl px-10 py-5 rounded-2xl shadow-lg active:scale-95 transition-transform select-none"
            >
              점프!
            </button>
          </div>

          {/* 게임 설명 */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: '🌵', label: '선인장 피하기', desc: '낮게 점프!' },
              { icon: '🐦', label: '새 피하기', desc: '타이밍 맞게!' },
              { icon: '⚡', label: '점점 빨라짐', desc: '200점마다 속도↑' },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                <div className="text-2xl mb-1">{tip.icon}</div>
                <div className="text-xs font-bold text-gray-700">{tip.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpGame;
