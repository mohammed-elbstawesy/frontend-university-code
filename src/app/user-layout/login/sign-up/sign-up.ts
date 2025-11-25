import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ScanService } from '../../../services/scan.service';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styles: []
})
export class SignUp {
  router = inject(Router);
  scanService = inject(ScanService);
  isLoading = false;

  // بيانات النموذج الموسعة
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    phone: '',
    nationalID: '',
    age: null,
    image: null as File | null,
    agreement: false // حالة الموافقة على الشروط
  };

  // دالة للتعامل مع اختيار ملف الصورة
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.formData.image = file;
    }
  }

  onSubmit() {
    // التحقق من الموافقة على الإقرار القانوني
    if (!this.formData.agreement) {
      alert('You must agree to the legal disclaimer to proceed.');
      return;
    }

    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      
      // دمج الاسم الأول والأخير
      const fullName = `${this.formData.firstName} ${this.formData.lastName}`;
      
      // يمكنك هنا إضافة منطق لإرسال باقي البيانات (الصورة، الرقم القومي، إلخ) للسيرفر
      // حالياً سنقوم بتسجيل الدخول فقط
      this.scanService.login(this.formData.email, fullName);
    }, 1500);
  }
}