import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../services/scan.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styles: []
})
export class SignIn {
  router = inject(Router);
  scanService = inject(ScanService);
  isLoading = false;

  formData = {
    email: '',
    password: ''
  };

  onSubmit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      // تسجيل الدخول وتوجيه المستخدم
      this.scanService.login(this.formData.email, 'Admin User');
    }, 1500);
  }
}