import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appFallbackImage]',
  standalone: true
})
export class FallbackImageDirective {
  @Input() appFallbackImage: string = '';

  // صورة SVG افتراضية (أيقونة شخص) مُرمزّة كـ Data URI — لا تحتاج لملف خارجي
  private readonly defaultAvatar = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
      <circle cx="12" cy="8" r="4"/>
      <path d="M5.5 21c0-4.14 2.91-7.5 6.5-7.5s6.5 3.36 6.5 7.5"/>
      <rect width="24" height="24" rx="4" fill="rgba(14,212,196,0.08)" stroke="rgba(14,212,196,0.15)"/>
    </svg>
  `)}`;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const element = this.el.nativeElement;
    // منع التكرار اللانهائي لو الصورة البديلة نفسها فشلت
    if (!element.dataset['fallbackApplied']) {
      element.dataset['fallbackApplied'] = 'true';
      element.src = this.appFallbackImage || this.defaultAvatar;
    }
  }
}
