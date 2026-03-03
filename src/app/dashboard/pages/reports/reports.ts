import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports {
  searchTerm = '';
  filterType = 'all';

  reports = [
    { id: 1, name: 'Weekly Security Report', type: 'weekly', date: '2024-01-15 10:30', vulns: 45, critical: 5, status: 'ready' },
    { id: 2, name: 'Monthly Summary - Dec', type: 'monthly', date: '2024-01-01 00:00', vulns: 127, critical: 12, status: 'ready' },
    { id: 3, name: 'API Endpoint Analysis', type: 'custom', date: '2024-01-10 14:22', vulns: 23, critical: 3, status: 'generating' },
    { id: 4, name: 'Weekly Security Report', type: 'weekly', date: '2024-01-08 10:30', vulns: 38, critical: 4, status: 'ready' }
  ];

  get filteredReports() {
    return this.reports.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFilter = this.filterType === 'all' || r.type === this.filterType;
      return matchesSearch && matchesFilter;
    });
  }

  getTypeClass(type: string) {
    const typeMap: { [key: string]: string } = {
      'weekly': 'badge-info',
      'monthly': 'badge-purple',
      'custom': 'badge-warning'
    };
    return typeMap[type] || 'badge-info';
  }

  getStatusClass(status: string) {
    return status === 'ready' ? 'badge-success' : 'badge-info';
  }

  download(id: number) {
    const report = this.reports.find(r => r.id === id);
    alert(`📥 Downloading report: ${report?.name}`);
  }
}