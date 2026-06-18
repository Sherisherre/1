import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let symbols: CodeSymbol[] = [];
    const mouse = { x: -9999, y: -9999, radius: 220 };

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    class CodeSymbol {
      x: number = 0;
      y: number = 0;
      vy: number = 0;
      text: string = '';
      fontSize: number = 0;
      opacity: number = 0;
      angle: number = 0;
      spinSpeed: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(initSpread = false) {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = initSpread ? Math.random() * canvas.height : canvas.height + 40;
        this.vy = -(Math.random() * 0.35 + 0.15); // float up slowly
        const characters = ['0', '1', '</>', '{ }', '[ ]', '=>', '++', '&&', 'git', 'cpu', 'web', '[]', '();', 'dir'];
        this.text = characters[Math.floor(Math.random() * characters.length)];
        this.fontSize = Math.floor(Math.random() * 6) + 11; // 11px to 17px
        this.opacity = Math.random() * 0.18 + 0.08; // very subtle background
        this.angle = (Math.random() - 0.5) * 0.15;
        this.spinSpeed = (Math.random() - 0.5) * 0.002;
      }

      update() {
        if (!canvas) return;
        this.y += this.vy;
        this.angle += this.spinSpeed;

        if (this.y < -40) {
          this.reset(false);
        }

        // Slight hover reaction
        if (mouse.x !== -9999) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.font = `${this.fontSize}px "JetBrains Mono", Consolas, monospace`;
        
        ctx.fillStyle = `rgba(147, 197, 253, ${this.opacity})`; // Neon blue/cyan coding accent matching the theme
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(147, 197, 253, 0.4)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
      }
    }

    class Star {
      x: number = 0;
      y: number = 0;
      baseX: number = 0;
      baseY: number = 0;
      vx: number = 0;
      vy: number = 0;
      radius: number = 0;
      alpha: number = 0;
      pulseSpeed: number = 0;
      pulsePhase: number = 0;
      color: string = '';

      constructor() {
        this.reset();
        // Distribute randomly across the initial screen
        if (canvas) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.baseX = this.x;
          this.baseY = this.y;
        }
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.12; // Slow elegant drifting
        this.vy = (Math.random() - 0.5) * 0.12;
        this.radius = Math.random() * 1.5 + 0.6; // Smaller, delicate stardust dots
        this.alpha = Math.random() * 0.6 + 0.15;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;

        const colors = [
          'rgba(255, 255, 255, ',
          'rgba(147, 197, 253, ', // Soft sky blue accent
          'rgba(196, 181, 253, ', // Soft lavender
          'rgba(103, 114, 229, ', // Indigo
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (!canvas) return;
        
        // Gentle slow linear drift
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap around boundaries gracefully
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;

        this.x = this.baseX;
        this.y = this.baseY;

        // Twinkle factor via sine wave
        this.pulsePhase += this.pulseSpeed;

        // Organic attraction wave to mouse position
        if (mouse.x !== -9999) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Elastic orbital pull
            this.x += (dx / dist) * force * 12;
            this.y += (dy / dist) * force * 12;
          }
        }
      }

      draw() {
        if (!ctx) return;
        const currentAlpha = Math.max(0.05, Math.min(1, this.alpha * (0.6 + Math.sin(this.pulsePhase) * 0.4)));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${currentAlpha})`;
        ctx.fill();
        
        // Tiny delicate outer glow for larger stars
        if (this.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${this.color}${currentAlpha * 0.15})`;
          ctx.fill();
        }
      }
    }

    function initElements() {
      if (!canvas) return;
      stars = [];
      symbols = [];
      const w = canvas.width;
      const h = canvas.height;

      // Fewer, higher-quality stars for a pristine look (prevents performance lag & clutter)
      const count = Math.min(110, Math.floor((w * h) / 12000));
      for (let i = 0; i < count; i++) {
        stars.push(new Star());
      }

      // Initialize code symbols floating layer
      const symbolCount = Math.min(25, Math.floor((w * h) / 30000));
      for (let i = 0; i < symbolCount; i++) {
        symbols.push(new CodeSymbol());
      }
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw smooth interactive spotlight glow
      if (mouse.x !== -9999) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius * 1.5
        );
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.04)');
        gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.01)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1.5. Draw and update Code Symbols (background layer)
      for (let i = 0; i < symbols.length; i++) {
        symbols[i].update();
        symbols[i].draw();
      }

      // 2. Draw stars & thin constellation lines
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();

        // Elegant constellation connection lines between close star nodes
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            const alpha = ((110 - dist) / 110) * 0.05 * stars[i].alpha;
            ctx.strokeStyle = `rgba(180, 198, 255, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="cosmic-bg-container" id="starfield-container">
      <canvas id="starfield-canvas" ref={canvasRef} />
    </div>
  );
}
