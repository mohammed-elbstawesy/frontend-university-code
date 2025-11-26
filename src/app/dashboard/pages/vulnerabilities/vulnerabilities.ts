import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vulnerabilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vulnerabilities.html',
  styles: []
})
export class Vulnerabilities {
  searchTerm = '';
  severityFilter = 'all';
  statusFilter = 'all';

  vulnerabilities = [
    { id: 1, title: 'SQL Injection in Login', desc: 'User input not sanitized in login form', severity: 'critical', url: 'https://api.example.com/auth', status: 'available', date: '2024-01-15' },
    { id: 2, title: 'XSS in Comment Section', desc: 'Reflected XSS vulnerability in comments', severity: 'high', url: 'https://app.example.com/blog', status: 'available', date: '2024-01-14' },
    { id: 3, title: 'IDOR Profile Endpoint', desc: 'Insecure direct object reference in profile', severity: 'high', url: 'https://api.example.com/user', status: 'resolved', date: '2024-01-13' },
    { id: 4, title: 'Missing Rate Limiting', desc: 'No rate limiting on password reset', severity: 'medium', url: 'https://api.example.com/reset', status: 'available', date: '2024-01-12' },
    { id: 5, title: 'Outdated SSL Cert', desc: 'SSL certificate using weak cipher', severity: 'low', url: 'https://staging.example.com', status: 'cancelled', date: '2024-01-10' }
  ];

  get filteredVulns() {
    return this.vulnerabilities.filter(v => {
      const matchSearch = v.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || v.desc.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchSev = this.severityFilter === 'all' || v.severity === this.severityFilter;
      const matchStatus = this.statusFilter === 'all' || v.status === this.statusFilter;
      return matchSearch && matchSev && matchStatus;
    });
  }
  
  getSeverityClass(severity: string) {
      const map: {[key: string]: string} = {
          'critical': 'bg-red-500/15 text-red-500 border-red-500/30',
          'high': 'bg-orange-500/15 text-orange-500 border-orange-500/30',
          'medium': 'bg-blue-500/15 text-blue-500 border-blue-500/30',
          'low': 'bg-slate-500/15 text-slate-400 border-slate-500/30'
      };
      return map[severity] || map['low'];
  }
  
  getStatusClass(status: string) {
      const map: {[key: string]: string} = {
          'available': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          'resolved': 'bg-green-500/10 text-green-500 border-green-500/20',
          'cancelled': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      };
      return map[status] || map['available'];
  }
  
  getStatusDotClass(status: string) {
      const map: {[key: string]: string} = {
          'available': 'bg-orange-500 shadow-[0_0_8px_rgba(255,140,66,0.6)] animate-pulse',
          'resolved': 'bg-green-500',
          'cancelled': 'bg-slate-400'
      };
      return map[status] || map['available'];
  }

  resolve(id: number) {
      const v = this.vulnerabilities.find(x => x.id === id);
      if(v) v.status = 'resolved';
  }
  
  cancel(id: number) {
      if(confirm('Cancel this vulnerability?')) {
          const v = this.vulnerabilities.find(x => x.id === id);
          if(v) v.status = 'cancelled';
      }
  }
  
  reopen(id: number) {
      const v = this.vulnerabilities.find(x => x.id === id);
      if(v) v.status = 'available';
  }
}