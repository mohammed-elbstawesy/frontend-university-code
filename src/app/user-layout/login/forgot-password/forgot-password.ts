import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  authService = inject(AuthService);
  router = inject(Router);
  
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
        // التوجيه لصفحة تغيير الباسورد مع تمرير الإيميل
        this.router.navigate(['/login/reset-password'], { queryParams: { email: email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error.message || 'Failed to send code';
      }
    });
  }


  backToLogin(){
    this.router.navigate(['']);
    console.log('test');
    
  }
}