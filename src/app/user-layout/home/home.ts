import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScanService } from '../../services/scan.service';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  scanService = inject(ScanService);
  router = inject(Router);

  urlInput: string = '';
  errorMessage: string = '';

  ngOnInit() {
    this.scanService.reset(); // تصفير البيانات عند الدخول
  }

  onSubmit() {
    // التحقق من صحة الرابط
    if (!this.urlInput.includes('.') || this.urlInput.length < 4) {
      this.errorMessage = 'Please enter a valid domain (e.g., example.com)';
      return;
    }

    this.errorMessage = '';
    
    // بدء الفحص (سيتم حفظ الرابط في السيرفس)
    this.scanService.startScan(this.urlInput);
    
    // التوجيه إلى صفحة تسجيل الدخول بدلاً من النتائج
    // المستخدم سيسجل دخوله ثم يرى النتائج
    this.router.navigate(['/login']);
  }
}