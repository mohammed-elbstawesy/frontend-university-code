import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../core/services/log.service';
import { LogEntry } from '../../../core/models/log.model';
@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log.html',
  styles: []
})
export class Log implements OnInit {
  protected Math = Math;
  // بيانات اللوجز
  logs: LogEntry[] = [];
  isLoading: boolean = false;

  // متغيرات الفلترة والصفحات
  searchTerm: string = '';
  levelFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalLogs: number = 0;
  totalPages: number = 0;

  constructor(private _logService: LogService) {}

  ngOnInit() {
    this.fetchLogs();
  }

  // دالة جلب البيانات
  fetchLogs() {
    this.isLoading = true;
    this._logService.getLogs(this.currentPage, this.itemsPerPage, this.searchTerm, this.levelFilter)
      .subscribe({
        next: (res) => {
          this.logs = res.data;
          this.totalLogs = res.totalLogs;
          this.totalPages = res.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching logs:', err);
          this.isLoading = false;
        }
      });
  }

  // عند البحث (نرجع للصفحة الأولى)
  onSearch() {
    this.currentPage = 1;
    this.fetchLogs();
  }

  // عند تغيير الفلتر
  onFilterChange() {
    this.currentPage = 1;
    this.fetchLogs();
  }

  // عند تغيير عدد العناصر في الصفحة
  onItemsPerPageChange() {
    this.currentPage = 1;
    this.fetchLogs();
  }

  // تغيير الصفحة
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchLogs();
    }
  }

  // تحديد ألوان الـ Level
  getLogLevelClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warn': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'debug': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  }
}