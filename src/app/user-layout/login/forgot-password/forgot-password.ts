import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css','./../login.css'],
})
export class ForgotPassword {
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);

  isLoading = false;
  message = '';
  error = '';

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    const email = this.forgotForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.show('Verification code sent to your email.', 'success');
        // التوجيه لصفحة تغيير الباسورد مع تمرير الإيميل
        this.router.navigate(['/login/reset-password'], { queryParams: { email: email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error.message || 'Failed to send code';
        this.toastService.show(this.error, 'error');
      }
    });
  }


  backToLogin() {
    this.router.navigate(['/login/signin']);
  }
}