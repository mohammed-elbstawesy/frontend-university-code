import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css','./../login.css'],
})
export class VerifyOtp implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  toastService = inject(ToastService);

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

  goBack() {
    this.router.navigate(['/login/signin']);
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
        this.toastService.show('Account verified successfully! Welcome.', 'success');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Verification failed';
        this.toastService.show(this.errorMessage, 'error');
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
        this.toastService.show(this.successMessage, 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to resend code';
        this.toastService.show(this.errorMessage, 'error');
      }
    });
  }
}