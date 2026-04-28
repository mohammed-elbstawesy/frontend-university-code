import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { ResultsService } from '../../../core/services/results.service';
import { ScanReport } from '../../../core/models/results.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit {
  private toastService = inject(ToastService);
  private resultsService = inject(ResultsService);
  
  searchTerm = '';
  filterType = 'all';
  reports: ScanReport[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.isLoading = true;
    this.resultsService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.toastService.show('❌ Failed to fetch reports', 'error');
        this.isLoading = false;
      }
    });
  }

  get filteredReports() {
    return this.reports.filter(r => {
      const urlString = r.url?.originalUrl || 'Unknown URL';
      const matchesSearch = urlString.toLowerCase().includes(this.searchTerm.toLowerCase());
      const severity = r.summary?.highestSeverity || 'safe';
      
      let matchesFilter = true;
      if (this.filterType !== 'all') {
         if (this.filterType === 'safe' && severity !== 'safe') matchesFilter = false;
         if (this.filterType === 'vulnerable' && severity === 'safe') matchesFilter = false;
      }
      return matchesSearch && matchesFilter;
    });
  }

  getSeverityClass(severity: string) {
    const typeMap: { [key: string]: string } = {
      'safe': 'badge-success',
      'Low': 'badge-info',
      'Medium': 'badge-warning',
      'High': 'badge-danger',
      'Critical': 'badge-danger'
    };
    return typeMap[severity] || 'badge-info';
  }

  formatDate(dateString: any) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // التحميل — بنبعت الـ reportId والـ service هيتعامل معاه
  download(reportId: string) {
    this.toastService.show(`📥 Preparing download...`, 'info');
    
    this.resultsService.downloadReport(reportId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VulnCraft_Report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toastService.show(`✅ Download started!`, 'success');
      },
      error: (err) => {
        console.error('Download error:', err);
        if (err.status === 404) {
          this.toastService.show(`⏳ Report PDF is still generating, try again later.`, 'info');
        } else {
          this.toastService.show(`❌ Error downloading report`, 'error');
        }
      }
    });
  }
}