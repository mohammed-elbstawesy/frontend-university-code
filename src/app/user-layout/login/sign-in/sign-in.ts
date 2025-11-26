import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../core/services/scan.service';


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
    if (!this.formData.email || !this.formData.password) {
        return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.scanService.login(this.formData.email, 'Admin User');
    }, 1500);
  }
}