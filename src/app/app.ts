import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScanService } from './core/services/scan.service';
import { Toast } from './shared/components/toast/toast';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Toast],
})
export class App implements AfterViewInit {
  protected readonly title = signal('frontend');
  scanService = inject(ScanService);

  urlInput: string = '';

  start() {
    if (!this.urlInput.trim()) return;
    this.scanService.startScan(this.urlInput);
  }

  reset() {
    this.scanService.reset();
    this.urlInput = '';
  }

  ngAfterViewInit(): void {
    this.initParticles();
    this.initCursorGlow();
  }

  private initParticles(): void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number }[] = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 20));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 212, 196, ${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  private initCursorGlow(): void {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });
  }
}
