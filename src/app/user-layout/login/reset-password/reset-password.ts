import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
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

  constructor() {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]] // ممكن تستخدم نفس الـ regex بتاع الـ signup
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
    if (!this.email) {
      this.router.navigate(['/login/forgot-password']);
    }
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    const data = {
      email: this.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login/signin']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error.message || 'Failed to reset password';
      }
    });
  }
}
