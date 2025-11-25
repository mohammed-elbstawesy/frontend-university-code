import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../services/scan.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // تأكد من استيراد ReactiveFormsModule
  templateUrl: './sign-up.html',
  styles: []
})
export class SignUp {
  router = inject(Router);
  scanService = inject(ScanService);
  fb = inject(FormBuilder);

  isLoading = false;
  signUpForm: FormGroup;

  constructor() {
    // تعريف النموذج وقواعد التحقق
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]+$')]],
      nationalID: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      age: ['', [Validators.required, Validators.min(18)]],
      image: [null], // اختياري أو يمكن جعله required
      agreement: [false, Validators.requiredTrue] // شرط أساسي
    });
  }

  // دالة تحديد لون الحقل (أخضر/أحمر/عادي)
  getFieldClass(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    
    // لم يلمس المستخدم الحقل بعد
    if (!field || !field.touched) {
      return 'border-slate-700 focus-within:border-[#00f0ff]'; 
    }

    // الحقل صحيح
    if (field.valid) {
      return 'border-green-500 focus-within:border-green-500 text-green-500'; 
    }

    // الحقل خطأ وتم لمسه
    return 'border-red-500 focus-within:border-red-500 text-red-500 animate-pulse';
  }

  // دالة لتحديد لون الـ Checkbox
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
    // إذا كان النموذج غير صالح، قم بلمس كل الحقول لإظهار الأخطاء
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.signUpForm.value;

    setTimeout(() => {
      this.isLoading = false;
      const fullName = `${formData.firstName} ${formData.lastName}`;
      this.scanService.login(formData.email, fullName);
    }, 1500);
  }
}