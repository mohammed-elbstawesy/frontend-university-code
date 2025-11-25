import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ضروري للـ Two-way binding
import { ScanService } from '../../services/scan.service';
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar], // أضف FormsModule
  templateUrl: './result.html',
  styles: []
})
export class Result {
  scanService = inject(ScanService);
  
  // متغير البحث (Signal)
  searchTerm = signal<string>('');

  // قائمة مصفاة (Filtered List) تعتمد على البحث
  filteredVulnerabilities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allVulns = this.scanService.vulnerabilities();
    
    if (!term) return allVulns; // إذا كان البحث فارغاً، اعرض الكل

    return allVulns.filter(v => 
      v.name.toLowerCase().includes(term) || 
      v.severity.toLowerCase().includes(term) ||
      v.description.toLowerCase().includes(term)
    );
  });

  // ... (باقي الدوال: getSeverityClass, downloadReport, statCards كما هي) ...
  
  getSeverityClass(severity: string): string {
    switch (severity) {
        case 'Critical': return 'text-[#ff003c] border-[#ff003c]/30 bg-[#ff003c]/10 shadow-[0_0_10px_rgba(255,0,60,0.2)]';
        case 'High': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
        case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
        default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  }

  // (تأكد أن مصفوفة statCards موجودة هنا كما في الكود السابق)
  readonly statCards = computed(() => [
    { title: 'Total', value: this.scanService.stats().total, styleClass: 'text-white', borderClass: 'border-slate-700' },
    { title: 'Critical', value: this.scanService.stats().critical, styleClass: 'text-[#ff003c]', borderClass: 'border-l-4 border-[#ff003c]' },
    { title: 'High', value: this.scanService.stats().high, styleClass: 'text-orange-500', borderClass: 'border-l-4 border-orange-500' },
    { title: 'Medium', value: this.scanService.stats().medium, styleClass: 'text-yellow-400', borderClass: 'border-l-4 border-yellow-400' },
    { title: 'Low', value: this.scanService.stats().low, styleClass: 'text-blue-400', borderClass: 'border-l-4 border-blue-400' }
  ]);

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
}