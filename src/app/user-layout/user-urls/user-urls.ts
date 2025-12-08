import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../home/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlService } from '../../core/services/url.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth.service';
import { Url } from '../../core/models/url.model';

@Component({
  selector: 'app-user-urls',
  imports: [Navbar, CommonModule, RouterLink, FormsModule],
  templateUrl: './user-urls.html',
  styleUrl: './user-urls.css',
})
export class UserUrls implements OnInit {
  // نبدأ بمصفوفة فارغة لأننا سنجلب البيانات من السيرفر
  userUrls: any[] = [];
  
  // متغيرات الفلترة والبحث
  filteredUrls: any[] = [];
  searchQuery: string = '';
  filterStatus: string = 'all';
  sortBy: string = 'date';
  viewMode: 'grid' | 'list' = 'grid';

  // الإحصائيات
  stats = {
    total: 0,
    critical: 0,
    warnings: 0,
    secure: 0,
    totalVulns: 0
  };

  token: any = '';
  userId: string = '';
  
  constructor(
    private _urlService: UrlService, 
    private router: Router, 
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. نجلب البيانات أولاً
    this.userIdByToken();
  }

  userIdByToken() {
    this.token = this._authService.getToken();
    if (this.token) {
      const decoded: any = jwtDecode(this.token);
      this.userId = decoded.id;
      
      this._urlService.getUrlByUserId(this.userId).subscribe({
        next: (res: any) => {
          console.log('Backend Response:', res);

          // 2. أهم خطوة: تحويل شكل البيانات من الباك اند لشكل الـ HTML
          this.userUrls = res.map((item: any) => ({
            id: item._id,                       // Backend (_id) -> Frontend (id)
            url: item.originalUrl,              // Backend (originalUrl) -> Frontend (url)
            date: this.formatDate(item.createdAt), // تنسيق التاريخ
            
            // بيانات افتراضية لأن الباك اند لا يرسلها حالياً
            // يمكنك تغييرها لاحقاً لتكون ديناميكية
            status: 'Scanning',                 
            vulnCount: 0,
            isScanning: true,                   
            lastIncident: 'N/A',
            // uptime: 100
          }));

          // 3. تحديث العرض والحسابات بعد وصول البيانات
          this.applyFilters();
          this.calculateStats();

          // محاكاة: بعد 3 ثواني نغير الحالة إلى Secure (اختياري للعرض فقط)
          setTimeout(() => {
            this.userUrls.forEach(u => {
              u.isScanning = false;
              u.status = 'Secure'; // أو أي منطق آخر
            });
            this.applyFilters();
            this.calculateStats();
          }, 2000);
        },
        error: (err) => console.error('Failed to load urls', err)
      });
    }
  }

  // دالة مساعدة لتنسيق التاريخ
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // --- بقية الدوال كما هي (بدون تغيير في المنطق) ---

  calculateStats(): void {
    this.stats.total = this.userUrls.length;
    this.stats.critical = this.userUrls.filter(u => u.status === 'High Risk').length;
    this.stats.warnings = this.userUrls.filter(u => 
      u.status === 'Medium Risk' || u.status === 'Low Risk'
    ).length;
    this.stats.secure = this.userUrls.filter(u => u.status === 'Secure').length;
    this.stats.totalVulns = this.userUrls.reduce((sum, u) => sum + u.vulnCount, 0);
  }

  applyFilters(): void {
    let filtered = [...this.userUrls];

    if (this.searchQuery) {
      filtered = filtered.filter(url => 
        url.url.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(url => url.status === this.filterStatus);
    }

    filtered.sort((a, b) => {
      switch(this.sortBy) {
        case 'vulns': return b.vulnCount - a.vulnCount;
        case 'name': return a.url.localeCompare(b.url);
        case 'date': return new Date(b.date).getTime() - new Date(a.date).getTime();
        default: return 0;
      }
    });

    this.filteredUrls = filtered;
  }

  onSearchChange(): void { this.applyFilters(); }
  onFilterChange(): void { this.applyFilters(); }
  onSortChange(): void { this.applyFilters(); }
  setViewMode(mode: 'grid' | 'list'): void { this.viewMode = mode; }

  goToResult(urlItem: any): void {
    if (urlItem.isScanning) return;
    this.router.navigate(['/result', urlItem.id]); 
  }

  handleRefreshAll(): void {
    this.userUrls = this.userUrls.map(url => ({ 
      ...url, isScanning: true, status: 'Scanning'
    }));
    this.applyFilters();
    setTimeout(() => {
      this.userUrls = this.userUrls.map(url => ({ 
        ...url, isScanning: false, status: 'Secure' // افتراضياً بعد التحديث
      }));
      this.applyFilters();
    }, 3000);
  }

  refreshUrl(urlItem: any, event?: Event): void {
    if (event) event.stopPropagation();
    urlItem.isScanning = true;
    urlItem.status = 'Scanning';
    this.applyFilters();
    setTimeout(() => {
      urlItem.isScanning = false;
      urlItem.status = 'Secure';
      this.applyFilters();
    }, 2000);
  }

  viewDetails(urlItem: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.goToResult(urlItem);
  }

  exportReport(): void {
    alert('Export functionality - قريباً!');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'High Risk': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Medium Risk': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Low Risk': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Secure': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Scanning': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  }

  getThreatClass(vulnCount: number): string {
    return vulnCount > 0 ? 'text-red-400' : 'text-emerald-400';
  }

  getStatusConfig(status: string): string {
    return this.getStatusColor(status);
  }
}