import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      mouseX = e.clientX - canvas.width / 2;
      mouseY = e.clientY - canvas.height / 2;
    };

    const handleScroll = () => {
      const delta = window.scrollY - lastScrollY;
      scrollSpeed += delta * 0.03;
      lastScrollY = window.scrollY;
    };

    class Star {
      depth: number;
      x: number = 0;
      y: number = 0;
      radius: number = 1;
      maxAlpha: number = 0.5;
      pulsate: boolean;
      alpha: number = 0;
      alphaChange: number;
      vx: number;
      vy: number;

      constructor() {
        this.depth = Math.random() * 0.9 + 0.1;
        this.pulsate = Math.random() > 0.98;
        this.alphaChange = Math.random() * 0.02 + 0.005;
        this.vx = (Math.random() - 0.5) * 0.1 * this.depth;
        this.vy = (Math.random() - 0.5) * 0.1 * this.depth;
        this.reset();
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = (Math.random() * 1.2 + 0.3) * this.depth;
        this.maxAlpha = (Math.random() * 0.5 + 0.3) * this.depth;
        this.alpha = this.maxAlpha;
      }

      draw() {
        if (!ctx || !canvas) return;
        const parallaxX = (mouseX / (canvas.width / 2)) * -25 * this.depth;
        const parallaxY = (mouseY / (canvas.height / 2)) * -25 * this.depth;

        if (this.pulsate) {
          this.alpha += this.alphaChange;
          if (this.alpha >= this.maxAlpha || this.alpha <= 0) {
            this.alphaChange *= -1;
          }
        } else {
          this.alpha = this.maxAlpha;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.beginPath();
        ctx.arc(this.x + parallaxX, this.y + parallaxY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(220, 80%, 95%)`;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      update() {
        if (!canvas) return;
        this.y += (scrollSpeed * this.depth) + this.vy;
        this.x += this.vx;

        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;

        this.draw();
      }
    }

    class ShootingStar {
      x: number = 0;
      y: number = 0;
      len: number = 0;
      speed: number = 0;
      size: number = 0;
      waitTime: number = 0;
      active: boolean = false;

      constructor() {
        this.reset();
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 10;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1 + 0.1;
        this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
        this.active = false;
      }

      update() {
        if (!canvas) return;
        if (this.active) {
          this.x -= this.speed;
          this.y += this.speed;
          if (this.x < 0 || this.y >= canvas.height) this.reset();
        } else if (this.waitTime < new Date().getTime()) {
          this.active = true;
        }
      }

      draw() {
        if (!ctx || !this.active) return;
        ctx.strokeStyle = `hsla(220, 100%, 80%, ${Math.random() * 0.5 + 0.5})`;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.stroke();
      }
    }

    function initStars() {
      if (!canvas) return;
      stars = [];
      shootingStars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
      for (let i = 0; i < 3; i++) {
        shootingStars.push(new ShootingStar());
      }
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => s.update());
      shootingStars.forEach(s => {
        s.update();
        s.draw();
      });
      scrollSpeed *= 0.9;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });

    resizeCanvas();
    initStars();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="cosmic-bg-container" id="starfield-container">
      <canvas id="starfield-canvas" ref={canvasRef} />
    </div>
  );
}
