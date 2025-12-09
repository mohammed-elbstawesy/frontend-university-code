// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Url } from '../../../core/models/url.model';
// import { UrlService } from '../../../core/services/url.service';
// import { ResultsService } from '../../../core/services/results.service';
// import { ScanReport } from '../../../core/models/results.model'; // 🔥 استدعاء الموديل الجديد

// @Component({
//   selector: 'app-urls',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './urls.html',
// })
// export class Urls implements OnInit {
  
//   constructor(
//     private _url: UrlService,
//     private _result: ResultsService
//   ) {}

//   searchTerm = '';
//   vulnCountsMap: { [key: string]: number } = {}; // لتخزين عدد الثغرات لكل رابط
//   URLS: Url[] = [];

//   ngOnInit() {
//     this.loadUrls();
//   }

//   loadUrls() {
//     this._url.getUrls().subscribe({
//       next: (res: Url[]) => {
//         this.URLS = res;
//         // جلب عدد الثغرات لكل رابط
//         this.URLS.forEach(url => {
//           this.fetchVulnCount(url._id);
//         });
//       },
//       error: (err) => console.error('Error fetching URLs:', err)
//     });
//   }

//   // 🔥 التعديل الأساسي هنا: التعامل مع التقارير بدلاً من النتائج
//   fetchVulnCount(id: string) {
//     this._result.getReportsByUrlId(id).subscribe({
//       next: (reports: ScanReport[]) => {
//         // الباك إند بيرجع التقارير مترتبة بالأحدث
//         if (reports && reports.length > 0) {
//           const latestReport = reports[0];
//           // نقرأ العدد من الملخص الجاهز في التقرير
//           this.vulnCountsMap[id] = latestReport.summary.totalVulnerabilities;
//         } else {
//           this.vulnCountsMap[id] = 0;
//         }
//       },
//       error: (err) => {
//         console.error(`Error fetching count for ${id}`, err);
//         this.vulnCountsMap[id] = 0;
//       }
//     });
//   }

//   // الفلترة
//   get filteredUrls(): Url[] {
//     const q = this.searchTerm.trim().toLowerCase();
//     if (!q) return this.URLS;

//     return this.URLS.filter(u => {
//       const matchUrl = u.originalUrl && u.originalUrl.toLowerCase().includes(q);
//       const matchEmail = u.user?.email && u.user.email.toLowerCase().includes(q);
//       return matchUrl || matchEmail;
//     });
//   }

//   // إعادة الفحص
//   rescan(urlObj: Url) {
//     if(!confirm(`Start scanning ${urlObj.originalUrl}?`)) return;

//     this._result.runNewScan(urlObj.originalUrl).subscribe({
//       next: () => {
//         alert('Scan started successfully!');
//         // تحديث الحالة محلياً لحين انتهاء الفحص
//         // (يمكنك هنا إعادة تحميل القائمة بعد فترة أو الاعتماد على WebSockets لو متطور)
//         this.loadUrls(); 
//       },
//       error: (err) => console.error(err)
//     });
//   }

//   // تحسين استخراج اسم الموقع
//   extractSiteName(url: string): string {
//     if (!url) return '';
//     try {
//       // محاولة استخدام URL API لو النص سليم
//       const hostname = new URL(url).hostname;
//       return hostname.replace('www.', '');
//     } catch {
//       // Fallback للطريقة اليدوية لو الرابط مش كامل
//       let domain = url.replace(/(^\w+:|^)\/\//, '');
//       domain = domain.replace('www.', '');
//       return domain.split('/')[0];
//     }
//   }

//   // تنسيق الألوان حسب الحالة (مطابق للباك إند)
//   getStatusBadgeClass(status: string) {
//     const statusMap: { [key: string]: string } = {
//       'Finished': 'bg-green-500/10 text-green-500 border border-green-500/20',
//       'Scanning': 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse',
//       'Failed': 'bg-red-500/10 text-red-500 border border-red-500/20',
//       'UnScaned': 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
//     };
//     return statusMap[status] || 'bg-slate-500/10 text-slate-400';
//   }

//   // تنسيق ألوان العدد
//   getVulnCountClass(count: number) {
//     if (count >= 5) return 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
//     if (count > 0) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
//     return 'bg-slate-800 text-slate-500';
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Url } from '../../../core/models/url.model';
import { UrlService } from '../../../core/services/url.service';
import { ResultsService } from '../../../core/services/results.service';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './urls.html',
})
export class Urls implements OnInit {
  
  constructor(
    private _url: UrlService,
    private _result: ResultsService
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
        // لاحظ: لم نعد بحاجة لجلب عدد الثغرات منفصلاً
        // لأن الباك إند يرسلها الآن داخل كائن الـ Url نفسه (numberOfvuln)
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

  // دالة إعادة الفحص
  rescan(urlObj: Url) {
    if(!confirm(`Start scanning ${urlObj.originalUrl}?`)) return;

    // تحديث الحالة محلياً فوراً لتحسين تجربة المستخدم
    urlObj.status = 'Scanning';

    this._result.runNewScan(urlObj.originalUrl).subscribe({
      next: (response) => {
        alert('Scan started successfully!');
        // بعد انتهاء الفحص (أو بدئه)، نعيد تحميل القائمة لتحديث البيانات
        // ملاحظة: الفحص قد يأخذ وقتاً، في التطبيقات المتقدمة نستخدم Socket
        // هنا سنكتفي بتحديث القائمة
        this.loadUrls(); 
      },
      error: (err) => {
        console.error(err);
        urlObj.status = 'Failed'; // إرجاع الحالة لخطأ لو فشل الطلب
        alert('Failed to start scan.');
      }
    });
  }

  // استخراج اسم الموقع للعرض
  extractSiteName(url: string): string {
    if (!url) return '';
    try {
        // محاولة استخدام الطريقة القياسية
        const hostname = new URL(url).hostname;
        return hostname.replace('www.', '');
    } catch {
        // Fallback
        let domain = url.replace(/(^\w+:|^)\/\//, '');
        domain = domain.replace('www.', '');
        return domain.split('/')[0];
    }
  }
  
  // تنسيق ألوان الحالة
  getStatusBadgeClass(status: string | undefined) {
        const statusMap: {[key: string]: string} = {
            'Finished': 'bg-green-500/10 text-green-500 border border-green-500/20',
            'Scanning': 'bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse',
            'Failed': 'bg-red-500/10 text-red-500 border border-red-500/20',
            'UnScaned': 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        };
        return statusMap[status || 'UnScaned'] || 'bg-slate-500/10 text-slate-400';
  }
    
  // تنسيق ألوان عداد الثغرات
  getVulnCountClass(count: number | undefined) {
      const c = count || 0;
      if (c >= 5) return 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      if (c > 0) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      return 'bg-slate-800 text-slate-500'; 
  }
}