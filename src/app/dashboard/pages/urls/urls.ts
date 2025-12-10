import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Url } from '../../../core/models/url.model';
import { UrlService } from '../../../core/services/url.service';
import { ResultsService } from '../../../core/services/results.service';
import { Router } from '@angular/router'; // 1. استدعاء Router

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './urls.html',
})
export class Urls implements OnInit {
  
  constructor(
    private _url: UrlService,
    private _result: ResultsService,
    private _router: Router // 2. حقن Router
  ) {}

  searchTerm = '';
  URLS: Url[] = [];

  ngOnInit() {
    this.loadUrls();
  }

  loadUrls() {
    this._url.getUrls().subscribe({
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

  // دالة إعادة الفحص (تركتها لك لو احتجتها لاحقاً)
  rescan(urlObj: Url) {
    if(!confirm(`Start scanning ${urlObj.originalUrl}?`)) return;

    urlObj.status = 'Scanning'; 

    this._result.runNewScan(urlObj._id).subscribe({
      next: (response) => {
        alert('Scan started successfully!');
        this.loadUrls(); 
      },
      error: (err) => {
        console.error(err);
        urlObj.status = 'Failed'; 
        alert('Failed to start scan.');
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
        const statusMap: {[key: string]: string} = {
            'Finished': 'bg-green-500/10 text-green-500 border border-green-500/20',
            'Scanning': 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse',
            'Failed': 'bg-red-500/10 text-red-500 border border-red-500/20',
            'UnScaned': 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        };
        return statusMap[status || 'UnScaned'] || 'bg-slate-500/10 text-slate-400';
  }
    
  getVulnCountClass(count: number | undefined) {
      const c = count || 0;
      if (c >= 5) return 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      if (c > 0) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      return 'bg-slate-800 text-slate-500'; 
  }
}