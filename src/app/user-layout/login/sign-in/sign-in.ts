import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../core/services/scan.service';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink,ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styles: []
})
export class SignIn {
constructor(private _authService:AuthService,private router:Router){}

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
        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/result']);
        }
      },
      error: (err) => {
        this.isLoading = false; // وقف التحميل حتى لو فشل
        console.log(err);

        // 2. خزن رسالة الخطأ اللي جاية من الباك إند
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your email or password.';
        }
      },
    });
  

  //   this.isLoading = true;
  //   setTimeout(() => {
  //     this.isLoading = false;
  //     this.scanService.login(this.formData.email, 'Admin User');
  //   }, 1500);
  



}







}