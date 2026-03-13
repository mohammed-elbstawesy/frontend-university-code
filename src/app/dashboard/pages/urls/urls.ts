import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Url } from '../../../core/models/url.model';
import { UrlService } from '../../../core/services/url.service';
import { ResultsService } from '../../../core/services/results.service';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './urls.html',
  styleUrls: ['./urls.css']
})
export class Urls implements OnInit, OnDestroy {

  constructor(
    private _url: UrlService,
    private _result: ResultsService,
    private _router: Router,
    private toastService: ToastService,
    private _confirm: ConfirmService
  ) { }

  searchTerm = '';
  URLS: Url[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.startPollingUrls();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUrls() {
    this._url.getUrls().subscribe({
      next: (res: Url[]) => {
        this.URLS = res;
      },
      error: (err) => console.error('Error fetching URLs:', err)
    });
  }

  startPollingUrls() {
    // يراقب أي تحديثات كل 5 ثواني
    timer(0, 5000).pipe(
      switchMap(() => this._url.getUrls()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: Url[]) => {
        this.URLS = res;
      },
      error: (err) => console.error('Error fetching URLs:', err)
    });
  }

  get filteredUrls(): Url[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.URLS;

    return this.URLS.filter(u => {
      const matchUrl = u.originalUrl && u.originalUrl.toLowerCase().includes(q);
      const matchEmail = u.user?.email && u.user.email.toLowerCase().includes(q);
      return matchUrl || matchEmail;
    });
  }

  // --- دوال التنقل والعرض الجديدة ---

  // 3. دالة الذهاب لصفحة النتائج
  viewResults(id: string) {
    this._router.navigate(['/result', id]);
  }

  // 4. دالة إصلاح الرابط الخارجي (عشان يفتح الموقع صح وميفتحش صفحة فاضية)
  ensureProtocol(url: string): string {
    if (!url) return '';
    // لو الرابط مفيهوش http أو https بنضيفهم عشان المتصفح يفهم إنه رابط خارجي
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }

  // ----------------------------------

  async rescan(urlObj: Url) {
    const confirmed = await this._confirm.confirm({
      title: 'Start New Scan',
      message: `Are you sure you want to start scanning ${urlObj.originalUrl}?`,
      type: 'info',
      confirmText: 'Start Scan'
    });

    if (!confirmed) return;

    urlObj.status = 'Scanning';

    this._result.runNewScan(urlObj._id).subscribe({
      next: (response) => {
        this.toastService.show('Scan started successfully!', 'success');
        this.loadUrls();
      },
      error: (err) => {
        console.error(err);
        urlObj.status = 'Failed';
        this.toastService.show('Failed to start scan.', 'error');
      }
    });
  }

  extractSiteName(url: string): string {
    if (!url) return '';
    try {
      const hostname = new URL(this.ensureProtocol(url)).hostname; // استخدام ensureProtocol هنا أيضاً لتجنب الأخطاء
      return hostname.replace('www.', '');
    } catch {
      let domain = url.replace(/(^\w+:|^)\/\//, '');
      domain = domain.replace('www.', '');
      return domain.split('/')[0];
    }
  }

  getStatusBadgeClass(status: string | undefined) {
    const statusMap: { [key: string]: string } = {
      'Finished': 'badge-success',
      'Scanning': 'badge-info',
      'Failed': 'badge-danger',
      'UnScaned': 'badge-info'
    };
    return statusMap[status || 'UnScaned'] || 'badge-info';
  }

  getVulnCountClass(count: number | undefined) {
    const c = count || 0;
    if (c >= 5) return 'badge-danger';
    if (c > 0) return 'badge-warning';
    return 'badge-info';
  }

}