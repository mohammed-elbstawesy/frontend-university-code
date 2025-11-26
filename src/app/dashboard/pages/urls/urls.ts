import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './urls.html',
 
})
export class Urls {
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

  
  rescan(id: number) {
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

  delete(id: number) {
    if(confirm('Are you sure you want to delete this URL?')) {
      this.urls = this.urls.filter(u => u.id !== id);
    }
  }
  
  getStatusBadgeClass(status: string) {
        const statusMap: {[key: string]: string} = {
            'active': 'bg-green-500/10 text-green-500',
            'scanning': 'bg-blue-500/10 text-blue-500',
            'error': 'bg-red-500/10 text-red-500'
        };
        return statusMap[status] || 'bg-green-500/10 text-green-500';
    }
    
    getVulnCountClass(count: number) {
        if (count >= 5) return 'bg-red-500/10 text-red-500';
        if (count > 0) return 'bg-orange-500/10 text-orange-500';
        return 'bg-[#121829] text-slate-400'; 
    }
}