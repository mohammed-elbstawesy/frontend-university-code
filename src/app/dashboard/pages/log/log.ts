import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../core/services/log.service';
import { LogEntry } from '../../../core/models/log.model';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log.html',
  styleUrls: ['./log.css']
})
export class Log implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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

  constructor(private _logService: LogService) { }

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startPolling() {
    timer(0, 5000).pipe(
      switchMap(() => this._logService.getLogs(this.currentPage, this.itemsPerPage, this.searchTerm, this.levelFilter)),
      takeUntil(this.destroy$)
    ).subscribe({
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

  getLogLevelClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return 'badge-danger';
      case 'warn': return 'badge-warning';
      case 'info': return 'badge-info';
      case 'debug': return 'badge-purple';
      default: return 'badge-info';
    }
  }
}