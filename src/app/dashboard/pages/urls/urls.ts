import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Url } from '../../../core/models/url.model';
import { UrlService } from '../../../core/services/url.service';
import { VulnService } from '../../../core/services/vuln.service';
import { ResultsService } from '../../../core/services/results.service';
import { results } from '../../../core/models/results.model';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './urls.html',
 
})
export class Urls implements OnInit {
  constructor(
    private _url:UrlService,
    private _result:ResultsService
  ){}
  searchTerm = '';
  
  
  urls = [
    { id: 1, name: 'Main API', url: 'https://api.example.com', status: 'active', lastScanned: '2024-01-15', vulnerabilities: 3 },
    { id: 2, name: 'Web App', url: 'https://app.example.com', status: 'scanning', lastScanned: '2024-01-14', vulnerabilities: 0 },
    { id: 3, name: 'Admin Panel', url: 'https://admin.example.com', status: 'active', lastScanned: '2024-01-13', vulnerabilities: 5 },
    { id: 4, name: 'Staging', url: 'https://staging.example.com', status: 'error', lastScanned: '2024-01-10', vulnerabilities: 2 }
  ];

  
  get filteredUrls() {
    return this.urls.filter(u => u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.url.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  
  rescan(id: any) {
    const url = this.urls.find(u => u.id === id);
    if (url) {
        url.status = 'scanning';
        alert(`Rescanning ${url.name}...`);
        setTimeout(() => {
            url.status = 'active';
            alert(`Scan completed for ${url.name}`);
        }, 2000);
    }
  }

  delete(id: any) {
    if(confirm('Are you sure you want to delete this URL?')) {
      this.urls = this.urls.filter(u => u.id !== id);
    }
  }
  
  getStatusBadgeClass(status: any) {
        const statusMap: {[key: string]: string} = {
            'active': 'bg-green-500/10 text-green-500',
            'scanning': 'bg-blue-500/10 text-blue-500',
            'error': 'bg-red-500/10 text-red-500'
        };
        return statusMap[status] || 'bg-green-500/10 text-green-500';
    }
    
    getVulnCountClass(count: any) {
        if (count >= 5) return 'bg-red-500/10 text-red-500';
        if (count > 0) return 'bg-orange-500/10 text-orange-500';
        return 'bg-[#121829] text-slate-400'; 
    }





    // عرف متغير يشيل النتائج مربوطة بالـ ID
    vulnCountsMap: { [key: string]: number } = {};
    URLS: Url[] = [];
    
    ngOnInit() {
      this._url.getUrls().subscribe({
        next: (res: Url[]) => {
          this.URLS = res;
          
          // بمجرد ما الـ URLs توصل، نجيب عدد الثغرات لكل واحد فيهم
          this.URLS.forEach(url => {
            this.fetchVulnCount(url._id);
          });
        },
        error: (err) => console.error('Error fetching URLs:', err)
      });
    }
    
    // دالة مساعدة بتجيب العدد وتخزنه في المتغير
    fetchVulnCount(id: string) {
      this._result.getResultsByIdUrl(id).subscribe({
        next: (res) => {
          // نحسب العدد
          const count = res.filter(r => r.detected).length;
          // نخزنه في الـ Map باستخدام الـ ID كـ مفتاح
          this.vulnCountsMap[id] = count;
        },
        error: (err) => console.error(`Error fetching count for ${id}`, err)
      });
    }




  extractSiteName(url: string): string {
    if (!url) return '';

    let domain = url.replace(/(^\w+:|^)\/\//, '');

    domain = domain.replace('www.', '');

    return domain.split('.')[0]; 
  }


}