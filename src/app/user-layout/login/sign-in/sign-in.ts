import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; 
import { ScanService } from '../../../core/services/scan.service';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UrlService } from '../../../core/services/url.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styles: []
})
export class SignIn {
  
  constructor(
    private _authService: AuthService,
    private router: Router,
    private _urlService: UrlService,
    private route: ActivatedRoute 
  ) {}
  showPassword = false;
  scanService = inject(ScanService);
  isLoading = false;
  errorMessage: string = '';
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    const data = { email: email!, password: password! };

    this.isLoading = true; 

    this._authService.login(data).subscribe({
      next: (res) => {
        const token = this._authService.getToken();
        let role = null;
        if (token) {
          const decoded: any = jwtDecode(token);
          role = decoded.role;
        }

        // 1. التحقق من Return URL أولاً (لحل مشكلة الرابط من الإيميل)
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } 
        else {
          // 2. اللوجيك القديم (Pending Data & Default Redirect)
          const pendingUrl = localStorage.getItem('pendingData');

          if (pendingUrl && role !== 'admin') {
            this._urlService.addUrl({ originalUrl: pendingUrl }).subscribe({
              next: (res) => {
                localStorage.removeItem('pendingData');
                this.router.navigate(['/result']); 
              },
              error: (err) => {
                console.error('Failed to save pending URL', err);
                this.router.navigate(['']);
              }
            });
          } else {
            // التوجيه الطبيعي
            if (role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['']); 
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);

        // 🔥🔥🔥 التعديل الجديد هنا 🔥🔥🔥
        // التحقق هل الحساب غير مفعل؟
        if (err.error && err.error.notVerified) {
            // توجيه المستخدم لصفحة الـ OTP مع تمرير الإيميل
            this.router.navigate(['/login/verify'], {
                queryParams: { email: email }
            });
            return; // وقف التنفيذ
        }

        // إظهار رسائل الخطأ العادية
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your email or password.';
        }
      },
    });
  }
}