import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from "./navbar/navbar";
import { VulnService } from '../../core/services/vuln.service';
import { Vulnerability } from '../../core/models/vuln.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service';
import { ScanReport, ScanDetail } from '../../core/models/results.model'; // الموديل الجديد
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './result.html',
  styleUrls: ["./result.css"]
})
export class Result implements OnInit {
  
  constructor(
    private _vuln: VulnService,
    private _urlService: UrlService,
    private _results: ResultsService
  ) {}

  // المتغيرات
  selectedVuln: Vulnerability | null = null;
  vulns: Vulnerability[] = []; // دي القائمة النهائية اللي هتتعرض في الـ HTML
  url: Url[] = [];
  urlName: any = '';
  
  // متغيرات التقرير الجديد
  latestReport: ScanReport | null = null;
  detectedDetails: ScanDetail[] = [];
  
  // الإحصائيات
  numberOfvuln: number = 0;
  numberOfCritical: number = 0;
  numberOfHigh: number = 0;
  
  // الفلاتر والبحث
  searchTerm: string = '';
  isFilterOpen: boolean = false;
  selectedSeverity: string = 'All';

  // ID الرابط (يمكنك جعله ديناميكي لاحقاً من الـ Router)
  targetUrlId: string = '6935aea46d225db9a9d73ce4'; 

  ngOnInit() {
    // 1. جلب بيانات الرابط (الاسم، إلخ)
    this._urlService.getUrlById(this.targetUrlId).subscribe({
      next: (response: any) => {
        this.url = response;
        this.urlName = response.originalUrl;
      },
      error: (error) => console.error('Error fetching URL:', error)
    });

    // 2. جلب التقارير ومعالجة البيانات
    this._results.getReportsByUrlId(this.targetUrlId).pipe(
      // الخطوة الأولى: استلام التقارير واستخراج أحدث واحد
      map((reports: ScanReport[]) => {
        if (!reports || reports.length === 0) return [];

        // نأخذ أول تقرير (الأحدث لأن الباك إند مرتبهم بالتاريخ)
        this.latestReport = reports[0];
        
        // نأخذ التفاصيل المصابة فقط
        this.detectedDetails = this.latestReport.details.filter(d => d.isDetected);
        
        // نستخرج مصفوفة الـ IDs فقط عشان نجيب تفاصيلهم الكاملة (الوصف والصور ان وجد)
        const detectedIds = this.detectedDetails.map(d => d.vulnerabilityId);
        return detectedIds;
      }),
      
      // الخطوة الثانية: جلب تفاصيل الثغرات الكاملة من VulnService
      switchMap((ids: string[]) => {
        if (!ids || ids.length === 0) return of([]);
        return this._vuln.getVulnsByIds(ids);
      })
    ).subscribe({
      next: (fullVulns) => {
        this.vulns = fullVulns; // تعبئة المصفوفة التي يعتمد عليها الـ HTML
        
        // حساب الإحصائيات
        // الأفضل نعتمد على المصفوفة الحالية عشان العداد يكون دقيق مع العرض
        this.numberOfvuln = this.vulns.length;
        this.numberOfCritical = this.vulns.filter(v => v.severity === 'Critical').length;
        this.numberOfHigh = this.vulns.filter(v => v.severity === 'High').length;
        
        console.log('Final Vulnerabilities loaded:', this.vulns);
      },
      error: (err) => console.error('Error fetching report/vulns:', err)
    });
  }

  // --- دوال الـ HTML (كما هي لم تتغير) ---

  openModal(vuln: Vulnerability) {
    this.selectedVuln = vuln;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedVuln = null;
    document.body.style.overflow = 'auto';
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectSeverity(severity: string) {
    this.selectedSeverity = severity;
    this.isFilterOpen = false;
  }

  get filteredVulns(): Vulnerability[] {
    let vulns = this.vulns;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      vulns = vulns.filter(v => 
        (v.name && v.name.toLowerCase().includes(term)) || 
        (v.severity && v.severity.toLowerCase().includes(term)) ||
        (v.description && v.description.toLowerCase().includes(term)) ||
        (v.smallDescription && v.smallDescription.toLowerCase().includes(term))
      );
    }

    if (this.selectedSeverity !== 'All') {
      vulns = vulns.filter(v => v.severity.toLowerCase() === this.selectedSeverity.toLowerCase());
    }

    return vulns;
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
        case 'Critical': return 'text-[#ff003c] border-[#ff003c]/30 bg-[#ff003c]/10 shadow-[0_0_10px_rgba(255,0,60,0.2)]';
        case 'High': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
        case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
        default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  }

  downloadReport(btn: HTMLButtonElement) {
    const span = btn.querySelector('span');
    const originalText = span?.innerText || 'Download Report';
    if(span) span.innerText = "Generating PDF...";
    btn.classList.add('opacity-75', 'cursor-wait');
    setTimeout(() => {
        if(span) span.innerText = "Report Downloaded!";
        btn.classList.remove('bg-[#7000ff]', 'hover:bg-purple-600');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        setTimeout(() => {
            if(span) span.innerText = originalText;
            btn.classList.remove('opacity-75', 'cursor-wait', 'bg-green-600', 'hover:bg-green-700');
            btn.classList.add('bg-[#7000ff]', 'hover:bg-purple-600');
        }, 2000);
    }, 1500);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}