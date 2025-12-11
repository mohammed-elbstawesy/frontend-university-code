import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vulnerability } from '../../core/models/vuln.model';
import { VulnService } from '../../core/services/vuln.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/users.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { ResultsService } from '../../core/services/results.service';
import { ScanReport } from '../../core/models/results.model';
import { LogService } from '../../core/services/log.service';
import { LogEntry } from '../../core/models/log.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class Stats implements OnInit {
  
  constructor(
    private _vulnService: VulnService,
    private _user: UserService,
    private _url: UrlService,
    private _result: ResultsService,
    private _logService: LogService
  ) {}

  // المتغيرات
  vuln: Vulnerability[] = [];
  users: User[] = [];
  urls: Url[] = [];
  reports: ScanReport[] = [];

  // العدادات
  numberOFvuln: number = 0;
  numberOFusers: number = 0;
  numberOFpending: number = 0;
  numberOFurls: number = 0;
  
  totalIssuesDetected: number = 0;
  totalReportsGenerated: number = 0;

  // متغيرات اللوجز
  logs: LogEntry[] = [];
  isLoadingLogs: boolean = false;

  // مصفوفة الإحصائيات
  stats = [
    { label: 'Total Vulnerabilities DB', value: 0, color: 'text-blue-500', bg: 'bg-blue-500/10', iconPath: 'M10 2L3 6V10C3 14.5 6.5 18.5 10 20C13.5 18.5 17 14.5 17 10V6L10 2Z' },
    { label: 'Pending Approval', value: 0, color: 'text-orange-500', bg: 'bg-orange-500/10', iconPath: 'M13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6Z M5 16C5 13.7909 6.79086 12 9 12H11C13.2091 12 15 13.7909 15 16V17H5V16Z' },
    { label: 'Users Accounts', value: 0, color: 'text-[#ff003c]', bg: 'bg-[#ff003c]/10', iconPath: 'M10 6V10M10 14H10.01M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z' },
    { label: 'Total Issues Found', value: 0, color: 'text-green-500', bg: 'bg-green-500/10', iconPath: 'M5 10L8 13L15 6' },
    { label: 'Tracked URLs', value: 0, color: 'text-pink-500', bg: 'bg-pink-500/10', iconPath: 'M8 12L12 8M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z' },
    { label: 'Reports Generated', value: 0, color: 'text-cyan-500', bg: 'bg-cyan-500/10', iconPath: 'M6 2H14C15.1 2 16 2.9 16 4V18L10 15L4 18V4C4 2.9 4.9 2 6 2Z' }
  ];

  ngOnInit() {
    this.fetchVulnerabilities();
    this.fetchUsers();
    this.fetchUrls();
    this.fetchReports();
    this.fetchLogs();
  }

  fetchVulnerabilities() {
    this._vulnService.getVuln().subscribe({
      next: (response) => {
        this.vuln = response.data;
        this.numberOFvuln = this.vuln.length;
        this.updateStat(0, this.numberOFvuln);
      },
      error: (error) => console.error('Error fetching Vulnerabilities:', error)
    });
  }

  fetchUsers() {
    this._user.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.numberOFusers = this.users.length;
        this.numberOFpending = this.users.filter(u => (u.userPending || '').toLowerCase() === 'pending').length;
        this.updateStat(2, this.numberOFusers);
        this.updateStat(1, this.numberOFpending);
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  fetchUrls() {
    this._url.getUrls().subscribe({
      next: (res) => {
        this.urls = res;
        this.numberOFurls = this.urls.length;
        this.updateStat(4, this.numberOFurls);
      },
      error: (error) => console.error('Error fetching URLS:', error)
    });
  }

  fetchReports() {
    this._result.getAllReports().subscribe({
      next: (res: ScanReport[]) => {
        this.reports = res;
        this.totalReportsGenerated = this.reports.length;
        this.totalIssuesDetected = this.reports.reduce((acc, curr) => {
          return acc + (curr.summary?.totalVulnerabilities || 0);
        }, 0);
        this.updateStat(3, this.totalIssuesDetected);
        this.updateStat(5, this.totalReportsGenerated);
      },
      error: (error) => console.error('Error fetching Reports:', error)
    });
  }

  updateStat(index: number, value: number) {
    if (this.stats[index]) {
      this.stats[index].value = value;
    }
  }

  // --- دوال اللوجز ---

  fetchLogs() {
    this.isLoadingLogs = true;
    
    // 🔥 التعديل هنا: تمرير قيم افتراضية للدالة
    // الصفحة 1، عدد 15 عنصر، بحث فارغ، كل المستويات
    this._logService.getLogs(1, 15, '', 'all').subscribe({
      next: (res) => {
        this.logs = res.data;
        this.isLoadingLogs = false;
      },
      error: (err) => {
        console.error('Error fetching logs:', err);
        this.isLoadingLogs = false;
      }
    });
  }

  getLogLevelClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warn': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  }
}