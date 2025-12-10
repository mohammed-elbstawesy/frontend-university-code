import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from "./navbar/navbar";
import { VulnService } from '../../core/services/vuln.service';
import { Vulnerability } from '../../core/models/vuln.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service';
import { ScanReport, ScanDetail } from '../../core/models/results.model';
import { map, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'; // 1. Added Router

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
    private _results: ResultsService,
    private _route: ActivatedRoute,
    private router: Router // 2. Injected Router for redirection
  ) {}

  // Variables
  selectedVuln: Vulnerability | null = null;
  vulns: Vulnerability[] = [];
  url: Url[] = [];
  urlName: any = '';
  
  latestReport: ScanReport | null = null;
  detectedDetails: ScanDetail[] = [];
  
  numberOfvuln: number = 0;
  numberOfCritical: number = 0;
  numberOfHigh: number = 0;
  
  searchTerm: string = '';
  isFilterOpen: boolean = false;
  selectedSeverity: string = 'All';

  targetUrlId: string = ''; 

  ngOnInit() {
    // Get ID from URL
    this.targetUrlId = this._route.snapshot.paramMap.get('id') || '';

    if (!this.targetUrlId) {
        console.error('No ID provided in the URL');
        this.router.navigate(['/user-urls']); // Redirect if no ID
        return; 
    }

    // 1. Fetch URL Data
    this._urlService.getUrlById(this.targetUrlId).subscribe({
      next: (response: any) => {
        this.url = response;
        this.urlName = response.originalUrl;
      },
      error: (error) => console.error('Error fetching URL:', error)
    });

    // 2. Fetch Reports & Handle Permissions
    this._results.getReportsByUrlId(this.targetUrlId).pipe(
      map((reports: ScanReport[]) => {
        if (!reports || reports.length === 0) return [];

        this.latestReport = reports[0];
        this.detectedDetails = this.latestReport.details.filter(d => d.isDetected);
        
        const detectedIds = this.detectedDetails.map(d => d.vulnerabilityId);
        return detectedIds;
      }),
      switchMap((ids: string[]) => {
        if (!ids || ids.length === 0) return of([]);
        return this._vuln.getVulnsByIds(ids);
      })
    ).subscribe({
      next: (fullVulns) => {
        this.vulns = fullVulns;
        this.numberOfvuln = this.vulns.length;
        this.numberOfCritical = this.vulns.filter(v => v.severity === 'Critical').length;
        this.numberOfHigh = this.vulns.filter(v => v.severity === 'High').length;
        
        // console.log('Final Vulnerabilities loaded:', this.vulns);
      },
      // 🔥 Updated Error Handling Logic
      error: (err) => {
        console.error('Error fetching report:', err);
        
        // Check for 403 Forbidden (Ownership check failed)
        if (err.status === 403) {
          alert("⛔ Access Denied: You do not own this report.");
          this.router.navigate(['/user-urls']); 
        } else {
          // Handle other errors (e.g., 404 Not Found)
          this.router.navigate(['/']);
        }
      }
    });
  }

  // ... HTML Helpers ...

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