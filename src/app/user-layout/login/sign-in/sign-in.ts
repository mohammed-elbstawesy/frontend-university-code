import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // 1. استدعاء ActivatedRoute
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
    private route: ActivatedRoute // 2. حقن ActivatedRoute
  ) {}

  scanService = inject(ScanService);
  isLoading = false;
  errorMessage: string = '';
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    const data = { email: email!, password: password! };

    this.isLoading = true; // تشغيل اللودينج

    this._authService.login(data).subscribe({
      next: () => {
        const token = this._authService.getToken();
        let role = null;
        if (token) {
          const decoded: any = jwtDecode(token);
          role = decoded.role;
        }

        // 🔥 3. المنطق الجديد: التحقق من Return URL أولاً
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];

        if (returnUrl) {
          // لو جاي من رابط معين (زي الإيميل)، وديه هناك فوراً
          this.router.navigateByUrl(returnUrl);
        } 
        else {
          // --- اللوجيك القديم (Pending Data & Default Redirect) ---
          
          const pendingUrl = localStorage.getItem('pendingData');

          if (pendingUrl && role !== 'admin') {
            this._urlService.addUrl({ originalUrl: pendingUrl }).subscribe({
              next: (res) => {
                // console.log('Pending URL saved');
                localStorage.removeItem('pendingData');
                // هنا ممكن نستخدم ال ID من res._id عشان نوديه لصفحة الانتظار لو حابب
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
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your email or password.';
        }
      },
    });
  }
}