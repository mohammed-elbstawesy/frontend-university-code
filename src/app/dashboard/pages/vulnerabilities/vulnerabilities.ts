import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VulnService } from '../../../core/services/vuln.service';
import { Vulnerability } from '../../../core/models/vuln.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-vulnerabilities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vulnerabilities.html',
  styles: []
})
export class Vulnerabilities implements OnInit {
  // بيانات وفلتر
  vulns: Vulnerability[] = [];

  // المتغيرات اللي القالب طالبها
  searchTerm: string = '';
  severityFilter: string = 'all';
  statusFilter: string = 'all';

  constructor(private _vulnService: VulnService) {}

  ngOnInit(): void {
    this._vulnService.getVuln().subscribe({
      next: (response) => {
        this.vulns = response?.data || [];
        console.log('vulns', this.vulns);
      },
      error: (err) => console.error('Error fetching Vulnerabilities:', err)
    });
  }

  // Getter للفلترة — القالب يستخدم filteredVulns.length
  get filteredVulns(): Vulnerability[] {
    return this.vulns.filter(v => {
      // نص البحث (بسيط، على name و smallDescription و description)
      const q = this.searchTerm.trim().toLowerCase();
      const matchesSearch = !q ||
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.smallDescription && v.smallDescription.toLowerCase().includes(q)) ||
        (v.description && v.description.toLowerCase().includes(q));

      // فلتر الشدة — نقارن case-insensitive، ونقبل 'all'
      const sev = this.severityFilter.toLowerCase();
      const matchesSeverity = sev === 'all' || (v.severity && v.severity.toLowerCase() === sev);

      // فلتر الحالة — نتعامل مع isActive boolean
      const status = this.statusFilter.toLowerCase();
      let matchesStatus = true;
      if (status !== 'all') {
        if (status === 'available') matchesStatus = v.isActive === true;
        else if (status === 'resolved') matchesStatus = v.isActive === false && v.isActive !== undefined && /* example */ false; 
        // ملاحظة: عندكم مفهوم الـ status قد يختلف — لو عندكم حقل status نصي استبدل الشروط بسهولة
        else if (status === 'cancelled') matchesStatus = v.isActive === false;
      }

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }

  // ارجع كلاسات حسب الشدة
  getSeverityClass(severity: string | undefined): string {
    const map: { [k: string]: string } = {
      'critical': 'bg-red-500/15 text-red-500 border-red-500/30',
      'high': 'bg-orange-500/15 text-orange-500 border-orange-500/30',
      'medium': 'bg-blue-500/15 text-blue-500 border-blue-500/30',
      'low': 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    };
    return map[(severity || '').toLowerCase()] || map['low'];
  }

  getStatusClass(isActive?: boolean): string {
    if (isActive === undefined) return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return isActive ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  getStatusDotClass(isActive?: boolean): string {
    if (isActive === undefined) return 'bg-slate-400';
    return isActive ? 'bg-orange-500 shadow-[0_0_8px_rgba(255,140,66,0.6)] animate-pulse' : 'bg-slate-400';
  }

  // عميل الأفعال — لاحقًا توصلها للـ service (هنا مجرد console/log)
  resolve(id: string | undefined) {
    if (!id) return;
    console.log('Resolve', id);
    // this._vulnService.resolve(id).subscribe(...)
  }

  cancel(id: string | undefined) {
    if (!id) return;
    if (!confirm('Cancel this vulnerability?')) return;
    console.log('Cancel', id);
    // this._vulnService.cancel(id).subscribe(...)
  }

  reopen(id: string | undefined) {
    if (!id) return;
    console.log('Reopen', id);
    // this._vulnService.reopen(id).subscribe(...)
  }


  trackById(index: number, item: Vulnerability): string {
    return item._id ?? String(index);
  }
}
