import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../home/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-urls',
  imports: [Navbar,CommonModule,RouterLink,FormsModule],
  templateUrl: './user-urls.html',
  styleUrl: './user-urls.css',
})
export class UserUrls implements OnInit {
  // دي داتا وهمية، المفروض هتجيبها من الـ API بت
userUrls = [
  { 
    id: 1, 
    url: 'acme-corp.com', 
    date: '2023-10-25', 
    status: 'High Risk', 
    vulnCount: 5,
    isScanning: false,
    lastIncident: '2 days ago',
    uptime: 98.2
  },
  { 
    id: 2, 
    url: 'my-startup.io', 
    date: '2023-11-01', 
    status: 'Secure', 
    vulnCount: 0,
    isScanning: false,
    lastIncident: 'Never',
    uptime: 99.9
  },
  { 
    id: 3, 
    url: 'test-server.net', 
    date: '2023-11-02', 
    status: 'Scanning', 
    vulnCount: 0,
    isScanning: true,
    lastIncident: 'N/A',
    uptime: 99.5
  },
  { 
    id: 4, 
    url: 'api.company.com', 
    date: '2023-11-03', 
    status: 'Medium Risk', 
    vulnCount: 3,
    isScanning: false,
    lastIncident: '1 week ago',
    uptime: 97.5
  },
  { 
    id: 5, 
    url: 'blog.example.com', 
    date: '2023-11-04', 
    status: 'Low Risk', 
    vulnCount: 1,
    isScanning: false,
    lastIncident: '3 weeks ago',
    uptime: 99.2
  }
];

// متغيرات الفلترة والبحث
filteredUrls: any[] = [];
searchQuery: string = '';
filterStatus: string = 'all';
sortBy: string = 'date';
viewMode: 'grid' | 'list' = 'grid';

// الإحصائيات
stats = {
  total: 0,
  critical: 0,
  warnings: 0,
  secure: 0,
  totalVulns: 0
};

constructor(private router: Router) {}

ngOnInit(): void {
  this.calculateStats();
  this.applyFilters();
  
}

// حساب الإحصائيات
calculateStats(): void {
  this.stats.total = this.userUrls.length;
  this.stats.critical = this.userUrls.filter(u => u.status === 'High Risk').length;
  this.stats.warnings = this.userUrls.filter(u => 
    u.status === 'Medium Risk' || u.status === 'Low Risk'
  ).length;
  this.stats.secure = this.userUrls.filter(u => u.status === 'Secure').length;
  this.stats.totalVulns = this.userUrls.reduce((sum, u) => sum + u.vulnCount, 0);
}

// تطبيق الفلاتر والبحث والترتيب
applyFilters(): void {
  let filtered = [...this.userUrls];

  // فلتر البحث
  if (this.searchQuery) {
    filtered = filtered.filter(url => 
      url.url.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // فلتر الحالة
  if (this.filterStatus !== 'all') {
    filtered = filtered.filter(url => url.status === this.filterStatus);
  }

  // الترتيب
  filtered.sort((a, b) => {
    switch(this.sortBy) {
      case 'vulns':
        return b.vulnCount - a.vulnCount;
      case 'name':
        return a.url.localeCompare(b.url);
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  this.filteredUrls = filtered;
}

// عند تغيير البحث
onSearchChange(): void {
  this.applyFilters();
}

// عند تغيير الفلتر
onFilterChange(): void {
  this.applyFilters();
}

// عند تغيير الترتيب
onSortChange(): void {
  this.applyFilters();
}

// تغيير وضع العرض
setViewMode(mode: 'grid' | 'list'): void {
  this.viewMode = mode;
}

// الذهاب لصفحة النتائج
goToResult(urlItem: any): void {
  // لو لسه بيعمل سكان مش هننقله
  if (urlItem.isScanning) return;

  this.router.navigate(['/result', urlItem.id]); 
}

// تحديث جميع العناصر
handleRefreshAll(): void {
  this.userUrls = this.userUrls.map(url => ({ 
    ...url, 
    isScanning: true, 
    status: 'Scanning'
  }));
  this.applyFilters();
  this.calculateStats();

  // محاكاة انتهاء السكان بعد 3 ثواني
  setTimeout(() => {
    this.userUrls = this.userUrls.map(url => ({ 
      ...url, 
      isScanning: false
    }));
    this.applyFilters();
  }, 3000);
}

// تحديث عنصر واحد
refreshUrl(urlItem: any, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  
  urlItem.isScanning = true;
  urlItem.status = 'Scanning';
  this.applyFilters();

  // محاكاة انتهاء السكان بعد 2 ثانية
  setTimeout(() => {
    urlItem.isScanning = false;
    this.applyFilters();
  }, 2000);
}

// عرض تفاصيل العنصر
viewDetails(urlItem: any, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  this.goToResult(urlItem);
}

// تصدير التقرير
exportReport(): void {
  console.log('Exporting report...');
  // هنا تضيف كود التصدير
  alert('Export functionality - قريباً!');
}

// دالة مساعدة لتحديد لون الحالة
getStatusColor(status: string): string {
  switch (status) {
    case 'High Risk': 
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'Medium Risk': 
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'Low Risk': 
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'Secure': 
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'Scanning': 
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    default: 
      return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  }
}

// دالة لتحديد لون عدد الثغرات
getThreatClass(vulnCount: number): string {
  return vulnCount > 0 ? 'text-red-400' : 'text-emerald-400';
}

// دالة getStatusConfig (مستخدمة في HTML)
getStatusConfig(status: string): string {
  return this.getStatusColor(status);
}
}