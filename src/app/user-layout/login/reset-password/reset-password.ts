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
  styleUrl: './reset-password.css', // تأكد أن هذا الملف موجود أو احذف السطر
})
export class ResetPassword implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);

  resetForm: FormGroup;
  email = '';
  isLoading = false;
  message = '';
  error = '';

  showPassword = false; // تم توحيد الاسم ليكون متناسق
  showConfirmPassword = false;
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

  constructor() {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  get pass() { return this.resetForm.get('password'); }
  
  hasLowerCase() { return /[a-z]/.test(this.pass?.value || ''); }
  hasUpperCase() { return /[A-Z]/.test(this.pass?.value || ''); }
  hasNumber() { return /\d/.test(this.pass?.value || ''); }
  hasSpecial() { return /[#@$!%*?&]/.test(this.pass?.value || ''); }
  hasMinLength() { return (this.pass?.value || '').length >= 8; }

  getFieldClass(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.touched) return 'border-slate-700 focus-within:border-[#00f0ff]';
    if (field.valid) return 'border-green-500 focus-within:border-green-500 text-green-500';
    return 'border-red-500 focus-within:border-red-500 text-red-500 animate-pulse';
  }

  // تم إصلاح استدعاء اسم الحقل ليصبح 'password' بدلاً من 'newPassword'
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password'); 
    const confirm = control.get('confirmPassword');
    
    // التحقق فقط إذا كان كلا الحقلين تم لمسهما أو الكتابة فيهما
    if (!pass || !confirm) return null;

    return pass.value === confirm.value ? null : { mismatch: true };
  };

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
    if (!this.email) {
      // this.router.navigate(['/login/forgot-password']); // يمكن تفعيل هذا السطر لاحقاً
    }
  }

  onSubmit() {
    if (this.resetForm.invalid) {
        this.resetForm.markAllAsTouched(); // إظهار الأخطاء عند الضغط
        return;
    }

    this.isLoading = true;
    this.error = '';

    const data = {
      email: this.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.password // إرسال القيمة الصحيحة للباك إند
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = 'Password reset successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/login/signin']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to reset password';
      }
    });
  }
}