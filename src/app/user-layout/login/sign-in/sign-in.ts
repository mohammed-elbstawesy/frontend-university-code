import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../core/services/scan.service';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UrlService } from '../../../core/services/url.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink,ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styles: []
})
export class SignIn {
constructor(private _authService:AuthService,private router:Router,private _urlService:UrlService){}

  scanService = inject(ScanService);
  isLoading = false;
  errorMessage: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });






  formData = {
    email: '',
    password: ''
  };

  onSubmit() {
    // if (!this.formData.email || !this.formData.password) {
    //     return;
    // }
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    const data = { email: email!, password: password! };
    if (!data.email || !data.password) {
      return;
    }

    this._authService.login(data).subscribe({
      next: () => {
        const token = this._authService.getToken();
        let role = null;
        if (token) {
          const decoded: any = jwtDecode(token);
          role = decoded.role;
          // console.log(role);
          
        }

        const pendingUrl = localStorage.getItem('pendingData');

        // لو فيه رابط معلق واليوزر مش أدمن (الأدمن بيروح الداشبورد)
        if (pendingUrl && role !== 'admin') {
          
          // ابعت الرابط للسيرفر
          this._urlService.addUrl({ originalUrl: pendingUrl }).subscribe({
            next: (res) => {
              console.log('Pending URL saved successfully');
              
              // 1. امسح الداتا عشان متتكررش
              localStorage.removeItem('pendingData');
              
              // 2. وديه لصفحة النتيجة
              this.router.navigate(['/result']);
            },
            error: (err) => {
              console.error('Failed to save pending URL', err);
              // حتى لو فشل الحفظ، وديه صفحة النتيجة أو الهوم بدل ما يعلق في اللوجين
              this.router.navigate(['']);
            }
          });

        } else {
          // ==========================================
          // السيناريو الطبيعي (مفيش داتا معلقة)
          // ==========================================
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['']); // أو home حسب رغبتك
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