import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css','./../login.css'],
})
export class ResetPassword implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  resetToken = ''

  resetForm: FormGroup;
  email = '';
  isLoading = false;
  message = '';
  error = '';

  // التحكم في الخطوات: 1 للـ OTP و 2 للباسورد
  step: 1 | 2 = 1;

  // متغيرات إعادة الإرسال
  resendTimer = 0;
  isResending = false;

  showPassword = false;
  showConfirmPassword = false;
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

  constructor() {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
  }

  goBack() {
    this.router.navigate(['/login/forgot-password']);
  }

  // الانتقال للخطوة الثانية بعد التأكد من فورمات الـ OTP
  // goToStepTwo() {
  //   if (this.resetForm.get('otp')?.valid) {
  //     this.isLoading = true;
  //     const otp = this.resetForm.get('otp')?.value;

  //     this.authService.verifyOTP(this.email, otp).subscribe({
  //       next: (res) => {
  //         this.resetToken = res.resetToken; // حفظ التوكن المستلم
  //         this.step = 2;
  //         this.isLoading = false;
  //         this.error = '';
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.error = err.error?.message || 'Invalid or expired code';
  //       }
  //     });
  //   }
  // }

  // ميثود إعادة إرسال الكود
  resendOtp() {
    if (this.resendTimer > 0 || this.isResending) return;

    this.isResending = true;
    this.error = '';
    this.message = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isResending = false;
        this.message = 'A new code has been sent to your email.';
        this.startTimer();
      },
      error: (err) => {
        this.isResending = false;
        this.error = err.error?.message || 'Failed to resend code';
      }
    });
  }

  startTimer() {
    this.resendTimer = 60;
    const interval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(interval);
    }, 1000);
  }

  get pass() { return this.resetForm.get('password'); }
  hasLowerCase() { return /[a-z]/.test(this.pass?.value || ''); }
  hasUpperCase() { return /[A-Z]/.test(this.pass?.value || ''); }
  hasNumber() { return /\d/.test(this.pass?.value || ''); }
  hasSpecial() { return /[#@$!%*?&]/.test(this.pass?.value || ''); }
  hasMinLength() { return (this.pass?.value || '').length >= 8; }

  getFieldClass(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.touched) return 'field-default';
    if (field.valid) return 'field-valid';
    return 'field-invalid';
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password');
    const confirm = control.get('confirmPassword');
    if (!pass || !confirm) return null;
    return pass.value === confirm.value ? null : { mismatch: true };
  };

  // onSubmit() {
  //   if (this.resetForm.invalid) {
  //       this.resetForm.markAllAsTouched();
  //       return;
  //   }

  //   this.isLoading = true;
  //   this.error = '';
  //   this.message = '';

  //   const data = {
  //     email: this.email,
  //     otp: this.resetForm.value.otp,
  //     newPassword: this.resetForm.value.password,
  //     resetToken: this.resetToken,

  //   };


  //   this.authService.resetPassword(data).subscribe({
  //     next: (res) => {
  //       this.isLoading = false;
  //       this.message = 'Password reset successfully! Redirecting...';
  //       setTimeout(() => this.router.navigate(['/login/signin']), 2000);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.error = err.error?.message || 'Session expired, please try again';
  //       if (this.error.includes('expired')) this.step = 1;
  //     },
      
  //   });
  // }


  goToStepTwo() {
    if (this.resetForm.get('otp')?.valid) {
      this.isLoading = true;
      this.error = ''; // تصغير الـ error قبل البدء
      const otp = this.resetForm.get('otp')?.value;

      this.authService.verifyOTP(this.email, otp).subscribe({
        next: (res) => {
          this.resetToken = res.resetToken; 
          this.step = 2;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          
          // --- هنا الكود الجديد للتعامل مع الأخطاء ---
          if (err.status === 429) {
            // لو اليوزر اتحظر بسبب الـ Rate Limiter
            this.error = err.error?.message || 'Too many attempts. Please try again in 15 minutes.';
          } else if (err.status === 400) {
            // لو الـ OTP غلط أو منتهي
            this.error = err.error?.message || 'The code you entered is incorrect.';
          } else {
            this.error = 'Something went wrong. Please try again later.';
          }
        }
      });
    }
  }

  // 2. تعديل ميثود تغيير الباسورد النهائية
  onSubmit() {
    if (this.resetForm.invalid || !this.resetToken) {
        this.resetForm.markAllAsTouched();
        return;

    }

    this.isLoading = true;
    this.error = '';
    this.message = '';

    // لاحظ هنا: بعتنا الـ resetToken والباسورد الجديد بس (زي ما عملنا في الباك إند)
    const data = {
      resetToken: this.resetToken,
      newPassword: this.resetForm.value.password
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = 'Password reset successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/login/signin']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        
        // --- تعامل ذكي مع أخطاء الخطوة الأخيرة ---
        if (err.status === 429) {
          this.error = err.error?.message || 'Too many attempts.';
        } else if (err.status === 401 || err.status === 403) {
          // لو التوكن منتهي الصلاحية (بعد 5 دقائق)
          this.error = 'Your session has expired. Please verify your OTP again.';
          this.step = 1; // رجعه لخطوة الـ OTP
        } else {
          this.error = err.error?.message || 'An error occurred. Please try again.';

        }
      }
    });
  }


}