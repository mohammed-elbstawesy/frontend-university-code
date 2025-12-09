import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vulnerability } from '../../core/models/vuln.model';
import { VulnService } from '../../core/services/vuln.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/users.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service';
import { ScanReport } from '../../core/models/results.model'; // 🔥 استخدام الموديل الجديد

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styles: []
})
export class Stats implements OnInit {
  
  constructor(
    private _vulnService: VulnService,
    private _user: UserService,
    private _url: UrlService,
    private _result: ResultsService
  ) {}

  // المتغيرات
  vuln: Vulnerability[] = [];
  users: User[] = [];
  urls: Url[] = [];
  reports: ScanReport[] = []; // 🔥 تغيير النوع

  // العدادات
  numberOFvuln: number = 0;   // عدد أنواع الثغرات في قاعدة البيانات
  numberOFusers: number = 0;
  numberOFpending: number = 0;
  numberOFurls: number = 0;
  
  totalIssuesDetected: number = 0; // بدلاً من numberOfResult
  totalReportsGenerated: number = 0; // للتقارير

  // مصفوفة الإحصائيات للعرض
stats = [
    { label: 'Total Vulnerabilities DB', value: 0, color: 'text-blue-500', bg: 'bg-blue-500/10', iconPath: 'M10 2L3 6V10C3 14.5 6.5 18.5 10 20C13.5 18.5 17 14.5 17 10V6L10 2Z' },
    { label: 'Pending Approval', value: 0, color: 'text-orange-500', bg: 'bg-orange-500/10', iconPath: 'M13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6Z M5 16C5 13.7909 6.79086 12 9 12H11C13.2091 12 15 13.7909 15 16V17H5V16Z' },
    { label: 'Users Accounts', value: 0, color: 'text-[#ff003c]', bg: 'bg-[#ff003c]/10', iconPath: 'M10 6V10M10 14H10.01M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z' },
    { label: 'Total Issues Found', value: 0, color: 'text-green-500', bg: 'bg-green-500/10', iconPath: 'M5 10L8 13L15 6' },
    
    // اللون البنفسجي (ثابت الآن)
    { label: 'Tracked URLs', value: 0, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10', iconPath: 'M8 12L12 8M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z' },
    
    // تم التصحيح هنا: استخدام Hex Code للـ Cyan (#06b6d4) لضمان ظهوره
    { label: 'Reports Generated', value: 0, color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/10', iconPath: 'M6 2H14C15.1 2 16 2.9 16 4V18L10 15L4 18V4C4 2.9 4.9 2 6 2Z' }
];
  ngOnInit() {
    this.fetchVulnerabilities();
    this.fetchUsers();
    this.fetchUrls();
    this.fetchReports(); // 🔥 الدالة الجديدة
  }

  // 1. جلب تعريفات الثغرات
  fetchVulnerabilities() {
    this._vulnService.getVuln().subscribe({
      next: (response) => {
        this.vuln = response.data;
        this.numberOFvuln = this.vuln.length;
        this.updateStat(0, this.numberOFvuln);
      },
      error: (error) => console.error('Error fetching Vulnerabilities:', error)
    });
  }

  // 2. جلب المستخدمين
  fetchUsers() {
    this._user.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.numberOFusers = this.users.length;
        this.numberOFpending = this.users.filter(u => (u.userPending || '').toLowerCase() === 'pending').length;
        
        this.updateStat(2, this.numberOFusers);
        this.updateStat(1, this.numberOFpending);
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  // 3. جلب الروابط
  fetchUrls() {
    this._url.getUrls().subscribe({
      next: (res) => {
        this.urls = res;
        this.numberOFurls = this.urls.length;
        this.updateStat(4, this.numberOFurls);
      },
      error: (error) => console.error('Error fetching URLS:', error)
    });
  }

  // 4. جلب التقارير وحساب الإحصائيات (الأهم)
  fetchReports() {
    // تأكد أنك أضفت دالة getAllReports في السيرفس كما وضحت لك سابقاً
    // أو استخدم getAllResults لو كانت ما زالت موجودة وترجع التقارير
    this._result.getAllReports().subscribe({ // تأكد من اسم الدالة في السيرفس
      next: (res: ScanReport[]) => {
        this.reports = res;
        
        // أ. حساب عدد التقارير الكلي
        this.totalReportsGenerated = this.reports.length;
        
        // ب. حساب مجموع الثغرات المكتشفة في كل التقارير
        this.totalIssuesDetected = this.reports.reduce((acc, curr) => {
          return acc + (curr.summary?.totalVulnerabilities || 0);
        }, 0);

        // تحديث الواجهة
        this.updateStat(3, this.totalIssuesDetected); // Total Issues
        this.updateStat(5, this.totalReportsGenerated); // Reports Generated
        
        console.log('Total Reports:', this.totalReportsGenerated);
        console.log('Total Issues:', this.totalIssuesDetected);
      },
      error: (error) => console.error('Error fetching Reports:', error)
    });
  }

  // دالة مساعدة لتحديث المصفوفة بسهولة
  updateStat(index: number, value: number) {
    if (this.stats[index]) {
      this.stats[index].value = value;
    }
  }
}