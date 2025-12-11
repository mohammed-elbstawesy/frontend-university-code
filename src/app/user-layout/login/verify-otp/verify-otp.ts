import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // مهم
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // إضافة ReactiveFormsModule
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 🔥 أضفنا ReactiveFormsModule هنا
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  otpForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email = '';

  constructor() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
    if (!this.email) {
      this.router.navigate(['/login/signup']);
    }
  }

  onSubmit() {
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const data = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.authService.verifyAccount(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token); // تأكد ان الاسم token مش userToken عشان يبقى موحد
        
        // 🔥 حل الخطأ الثاني: استدعاء دالة saveUserData (تأكد من وجودها في السيرفس)
        // لو مش موجودة، ممكن نكتفي بحفظ التوكن
        // this.authService.saveUserData(); 
        
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Verification failed';
      }
    });
  }

  resendOtp() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendOtp(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'New code sent successfully!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to resend code';
      }
    });
  }
}