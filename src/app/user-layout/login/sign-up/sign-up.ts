import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../core/services/scan.service';
import { User } from '../../../core/models/users.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './sign-up.html',
  styles: []
})
export class SignUp {
  scanService = inject(ScanService);
  fb = inject(FormBuilder);
  
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
  isLoading = false;
  signUpForm: FormGroup;
  
  // متغيرات للتحكم في ظهور الباسورد
  showPassword = false;
  showRePassword = false;

  constructor(private _authService: AuthService, private router: Router) {    
    this.signUpForm = this.fb.group({
      fristName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      rePassword: ['', [Validators.required]], // حقل تأكيد الباسورد
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]+$'), Validators.minLength(7)]],
      nationalID: ['', [Validators.required, Validators.minLength(10)]],
      age: ['', [Validators.required, Validators.min(21)]],
      image: [null], 
      agreement: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator }); // إضافة الـ Validator هنا للمجموعة كاملة
  }

  // دالة التحقق من تطابق الباسورد
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const rePassword = control.get('rePassword');

    // إذا لم تكن الحقول موجودة بعد، لا تفعل شيئاً
    if (!password || !rePassword) return null;

    // إذا كان هناك اختلاف، نضع الخطأ على حقل rePassword نفسه
    if (password.value !== rePassword.value) {
      rePassword.setErrors({ ...rePassword.errors, mismatch: true });
    } else {
      // إذا تطابقوا، نقوم بإزالة خطأ mismatch مع الحفاظ على الأخطاء الأخرى إن وجدت
      if (rePassword.errors) {
        delete rePassword.errors['mismatch'];
        if (Object.keys(rePassword.errors).length === 0) {
          rePassword.setErrors(null);
        }
      }
    }
    return null; 
  }

  get pass() { return this.signUpForm.get('password'); }
  
  hasLowerCase() { return /[a-z]/.test(this.pass?.value || ''); }
  hasUpperCase() { return /[A-Z]/.test(this.pass?.value || ''); }
  hasNumber() { return /\d/.test(this.pass?.value || ''); }
  hasSpecial() { return /[#@$!%*?&]/.test(this.pass?.value || ''); }
  hasMinLength() { return (this.pass?.value || '').length >= 8; }

  getFieldClass(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    
    if (!field || !field.touched) {
      return 'border-slate-700 focus-within:border-[#00f0ff]'; 
    }

    if (field.valid) {
      return 'border-green-500 focus-within:border-green-500 text-green-500'; 
    }

    return 'border-red-500 focus-within:border-red-500 text-red-500 animate-pulse';
  }

  getCheckboxClass(): string {
    const field = this.signUpForm.get('agreement');
    if (field?.value === true) {
        return 'border-green-500 bg-green-500/10 text-green-500';
    }
    if (field?.invalid && field?.touched) {
        return 'border-red-500 bg-red-500/10 text-red-500 animate-pulse';
    }
    return 'border-[#ff003c]/30 bg-[#ff003c]/10';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.signUpForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
  
    this.isLoading = true; 

    const formData = new FormData();
    // نرسل البيانات (بدون rePassword لأنه غير مطلوب في الباك إند عادة)
    formData.append('fristName', this.signUpForm.value.fristName);
    formData.append('lastName', this.signUpForm.value.lastName);
    formData.append('email', this.signUpForm.value.email);
    formData.append('password', this.signUpForm.value.password);
    formData.append('location', this.signUpForm.value.location);
    formData.append('phone', this.signUpForm.value.phone);
    formData.append('nationalID', this.signUpForm.value.nationalID);
    formData.append('age', this.signUpForm.value.age);
  
    if (this.signUpForm.value.image) {
      formData.append('image', this.signUpForm.value.image);
    }
  
    this._authService.signup(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/login/verify'], { 
          queryParams: { email: this.signUpForm.value.email } 
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Signup failed", err);
      }
    });
  }
}