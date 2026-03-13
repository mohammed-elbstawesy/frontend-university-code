import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../home/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service'; // 🔥 إضافة السيرفس
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-user-urls',
  standalone: true, // تأكدت أنها standalone حسب ملفك
  imports: [Navbar, CommonModule, RouterLink, FormsModule],
  templateUrl: './user-urls.html',
  styleUrl: './user-urls.css',
})
export class UserUrls implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  userUrls: any[] = [];
  filteredUrls: any[] = [];

  // الفلاتر
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
    private _resultService: ResultsService, // 🔥 حقن سيرفس النتائج
    private router: Router,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userIdByToken();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  userIdByToken() {
    this.token = this._authService.getToken();
    if (this.token) {
      const decoded: any = jwtDecode(this.token);
      this.userId = decoded.id;
      this.startPolling();
    }
  }

  startPolling() {
    timer(0, 5000).pipe(
      switchMap(() => this._urlService.getUrlByUserId(this.userId)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        // تحويل بيانات الباك إند لتناسب واجهة المستخدم
        this.userUrls = res.map((item: any) => {
          // تحديد الحالة للعرض بناءً على بيانات الباك إند
          let displayStatus = 'Scanning';

          if (item.status === 'Scanning') displayStatus = 'Scanning';
          else if (item.status === 'UnScaned') displayStatus = 'Unscanned';
          else if (item.status === 'Failed') displayStatus = 'Failed';
          else {
            // لو الفحص خلص، نعرض الخطورة
            // Backend: 'High', 'Medium', 'Low', 'Critical', 'safe'
            // Frontend UI expects: 'High Risk', 'Medium Risk', etc.
            switch (item.severity) {
              case 'Critical': displayStatus = 'Critical'; break;
              case 'High': displayStatus = 'High Risk'; break;
              case 'Medium': displayStatus = 'Medium Risk'; break;
              case 'Low': displayStatus = 'Low Risk'; break;
              case 'safe': displayStatus = 'Secure'; break;
              default: displayStatus = 'Secure';
            }
          }

          return {
            id: item._id,
            url: item.originalUrl,
            date: this.formatDate(item.createdAt),
            // البيانات الحقيقية
            status: displayStatus,
            vulnCount: item.numberOfvuln || 0,
            isScanning: item.status === 'Scanning', // لتشغيل الأنيميشن
            lastIncident: item.updatedAt ? this.formatDate(item.updatedAt) : 'N/A'
          };
        });

        this.applyFilters();
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load urls', err)
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  calculateStats(): void {
    this.stats.total = this.userUrls.length;
    this.stats.critical = this.userUrls.filter(u => u.status === 'Critical' || u.status === 'High Risk').length;
    // التحذيرات تشمل المتوسط والمنخفض
    this.stats.warnings = this.userUrls.filter(u => u.status === 'Medium Risk' || u.status === 'Low Risk').length;
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
      switch (this.sortBy) {
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
    // نسمح بالدخول للصفحة حتى لو بيعمل سكان، عشان يشوف الهيستوري القديم
    this.router.navigate(['/result', urlItem.id]);
  }

  // 🔥 إعادة فحص الكل
  async handleRefreshAll() {
    const confirmed = await this.confirmService.confirm({
      title: 'Rescan All Assets',
      message: 'Are you sure you want to rescan ALL assets? This might take time.',
      type: 'warning',
      confirmText: 'Rescan All'
    });

    if (!confirmed) return;

    // تغيير الحالة محلياً فوراً
    this.userUrls.forEach(url => {
      url.isScanning = true;
      url.status = 'Scanning';
    });
    this.applyFilters();

    // إرسال الطلبات للباك إند
    // (يمكن تحسينها بـ Promise.all لو العدد كبير، لكن الـ Loop تفي بالغرض حالياً)
    this.filteredUrls.forEach(urlItem => {
      this._resultService.runNewScan(urlItem.id).subscribe({
        next: () => {
          // console.log(`Started scan for ${urlItem.url}`)
        },
        error: (err) => console.error(err)
      });
    });
  }

  // 🔥 إعادة فحص رابط واحد
  refreshUrl(urlItem: any, event?: Event): void {
    if (event) event.stopPropagation();

    urlItem.isScanning = true;
    urlItem.status = 'Scanning';

    this._resultService.runNewScan(urlItem.id).subscribe({
      next: () => {
        // لا نحتاج لعمل شيء، الباك إند شغال
        // يمكنك عمل reload للداتا بعد فترة أو ترك المستخدم يعمل refresh
      },
      error: (err) => {
        console.error(err);
        urlItem.isScanning = false;
        urlItem.status = 'Failed'; // لو السيرفر رفض الطلب
      }
    });
  }

  viewDetails(urlItem: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.goToResult(urlItem);
  }

  exportReport(): void {
    this.toastService.show('Export functionality coming soon!', 'info');
  }

  // تنسيق الألوان بناءً على الحالة المعروضة
  getStatusColor(status: string): string {
    switch (status) {
      case 'Critical': return 'text-[#ff003c] bg-[#ff003c]/10 border-[#ff003c]/30';
      case 'High Risk': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Medium Risk': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Low Risk': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Secure': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Scanning': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Unscanned': return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      case 'Failed': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  }

  getThreatClass(vulnCount: number): string {
    if (vulnCount >= 5) return 'text-[#ff003c]';
    if (vulnCount > 0) return 'text-red-400';
    return 'text-emerald-400';
  }

  // للحفاظ على التوافق مع ملف الـ HTML
  getStatusConfig(status: string): string {
    return this.getStatusColor(status);
  }
}