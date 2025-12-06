import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ضروري للـ Two-way binding
import { ScanService } from '../../core/services/scan.service';
import { Navbar } from "./navbar/navbar";
import { VulnService } from '../../core/services/vuln.service';
import { Vulnerability } from '../../core/models/vuln.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service';
import { results } from '../../core/models/results.model';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar], // أضف FormsModule
  templateUrl: './result.html',
  styles: []
})
export class Result implements OnInit {
  constructor(private _vuln:VulnService,
    private _urlService:UrlService,
    private _results:ResultsService
  ){}
  selectedVuln: Vulnerability | null = null;
  vulns:Vulnerability[]=[]
  url: Url[] = [];
  urlName:any=''
  results:results[]=[];
  afterFilterResults:results[]=[];
  detectedIds:any[]=[]
  numberOfvuln:number=0
  numberOfCritical:number=0
  numberOfHigh:number=0
  searchTerm:string='';
  isFilterOpen: boolean = false; // للتحكم في فتح وغلق القائمة
  selectedSeverity: string = 'All';

  // قائمة مصفاة (Filtered List) تعتمد على البحث
  // filteredVulnerabilities = computed(() => {
  //   const term = this.searchTerm().toLowerCase();
  //   const allVulns = this.scanService.vulnerabilities();
    
  //   if (!term) return allVulns; // إذا كان البحث فارغاً، اعرض الكل

  //   return allVulns.filter(v => 
  //     v.name.toLowerCase().includes(term) || 
  //     v.severity.toLowerCase().includes(term) ||
  //     v.description.toLowerCase().includes(term)
  //   );
  // });
  openModal(vuln: Vulnerability) {
    this.selectedVuln = vuln;
    document.body.style.overflow = 'hidden'; // لمنع التمرير في الخلفية
  }

  closeModal() {
    this.selectedVuln = null;
    document.body.style.overflow = 'auto'; // إعادة التمرير
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

selectSeverity(severity: string) {
    this.selectedSeverity = severity;
    this.isFilterOpen = false; // اقفل القائمة بعد الاختيار
  }

  get filteredVulns(): Vulnerability[] {
    let vulns = this.vulns;

    // أولاً: تطبيق فلتر البحث (Search)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      vulns = vulns.filter(v => 
        (v.name && v.name.toLowerCase().includes(term)) || 
        (v.severity && v.severity.toLowerCase().includes(term)) ||
        (v.description && v.description.toLowerCase().includes(term)) ||
        (v.smallDescription && v.smallDescription.toLowerCase().includes(term))
      );
    }

    // ثانياً: تطبيق فلتر الشدة (Severity)
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
    // ... (نفس كود التحميل السابق)
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







  ngOnInit() {


        this._urlService.getUrlById('69247a4c1cbc757b5d0008f1').subscribe({
          next: (response: any) => {
            this.url = response
            // console.log('What did the server actually send?', response);
            // console.log('Is it an array?', Array.isArray(response));
            // // this.urlName = this.url.filter(r=>r.originalUrl);
            // const found =  this.url.find(r=>r.originalUrl)
            this.urlName =response.originalUrl;
            console.log('URLs:', this.url);
          },
          error: (error) => console.error('Error fetching URLs:', error)
        });

  

        this._results.getResultsByIdUrl('69247a4c1cbc757b5d0008f1').pipe(
          map((res: results[]) => {
            this.afterFilterResults = res.filter(r => r.detected);
            this.detectedIds = this.afterFilterResults.map(r => r.vulnerability);
            return this.detectedIds;
          }),
          switchMap((ids: string[]) => {
            if (!ids.length) return of([]);
            return this._vuln.getVulnsByIds(ids);
          })
        ).subscribe({
          next: (vulns) => { this.vulns = vulns; console.log('vulns', vulns);
             this.numberOfvuln=vulns.length;
             this.numberOfCritical=vulns.filter(r=>r.severity==='Critical').length
             this.numberOfHigh=vulns.filter(r=>r.severity==='High').length
            },
          error: (err) => console.error(err)
        });


        


  

      }



      trackById(index: number, item: any): string {
        return item._id; // أو item.id إن كان هكذا
      }
      
      viewDetails(id: string) {
        // مثال: لو تريد تروّج لصفحة تفاصيل عبر router
        // this.router.navigate(['/vulnerabilities', id]);
      
        // أو ببساطة اطبع أو افتح modal
        console.log('view details for', id);
        // هنا ضع منطق فتح modal أو تمرير البيانات إلى تفاصيل
      }

}