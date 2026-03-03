import { Component, inject, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScanService } from '../../core/services/scan.service';
import { UrlService } from '../../core/services/url.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultsService } from '../../core/services/results.service';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, AboutComponent, ServicesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  scanService = inject(ScanService);
  router = inject(Router);

  urlForm!: FormGroup;
  errorMessage: string = '';

  // Hero typing effect
  typingWords = ['Digital Age', 'Enterprise Apps', 'Cloud Infrastructure', 'Web Applications', 'API Endpoints'];
  typingText = '';
  private typingTimeout: any;

  // FAQ accordion
  faqOpen: boolean[] = [false, false, false, false];

  readonly urlRegex = /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/;






  constructor(
    private _urlService: UrlService,
    private _authService: AuthService,
    private _scanService: ResultsService
  ) { }

  islogin: boolean = false;
  role: string = 'admin';

  ngOnInit() {
    this.islogin = this._authService.isLogin();
    this.role = this._authService.getRole() === 'admin' ? 'admin' : 'user';
    this.scanService.reset();

    this.urlForm = new FormGroup({
      originalUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(this.urlRegex),
      ]),
    });

    // Hero typing effect
    this.initTyping();
  }

  ngOnDestroy() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  initTyping() {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = this.typingWords[wordIndex];
      if (isDeleting) {
        this.typingText = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        this.typingText = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % this.typingWords.length;
        delay = 400;
      }
      this.typingTimeout = setTimeout(type, delay);
    };
    this.typingTimeout = setTimeout(type, 1200);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      setTimeout(() => {
        const animatedElements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el: Element) => observer.observe(el));
      }, 100);
    }
  }

  toggleFaq(index: number) {
    this.faqOpen[index] = !this.faqOpen[index];
  }

  onSubmit() {
    if (this.urlForm.invalid) {
      this.errorMessage = 'Please enter a valid domain (e.g. google.com or https://example.com)';
      return;
    }

    const urlInput = this.urlForm.value.originalUrl;

    if (this.islogin) {

      // 1. إضافة الرابط للداتا بيس أولاً
      this._urlService.addUrl({ originalUrl: urlInput }).subscribe({
        next: (response: any) => {
          // console.log('URL added successfully:', response);

          // 🔥 التعديل هنا: نأخذ الـ ID من الاستجابة لبدء الفحص
          const urlId = response._id;

          // 2. بدء الفحص باستخدام الـ ID
          this._scanService.runNewScan(urlId).subscribe({
            next: () => { }
            // console.log('Scan started successfully')
            ,
            error: (err) =>
              console.error('Error starting scan:', err),
          });

          // 3. التوجيه
          if (this.role === 'admin') {
            this.router.navigate(['/dashboard/urls']); // الأفضل توجيهه لصفحة الروابط
          } else {
            // توجيه اليوزر لصفحة الانتظار أو النتيجة (حسب اللوجيك بتاعك)
            // هنا ممكن تبعت الـ ID كمان عشان الصفحة تعرض تفاصيله
            this.router.navigate(['/scanning-wait', response._id]);
          }
        },
        error: (error) =>
          console.error('Error adding URL:', error),
      });

    } else {
      // لو مش مسجل دخول، احفظ الرابط في اللوكال ستوريج ووديه يسجل
      localStorage.setItem('pendingData', urlInput);
      this.router.navigate(['/login']);
    }

    this.errorMessage = '';
  }
}