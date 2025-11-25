import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface Vulnerability {
  id: string; name: string; description: string; severity: 'Critical' | 'High' | 'Medium' | 'Low'; cveId: string; discoveredAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  private router = inject(Router);

  // Signals
  readonly user = signal<{ name: string; email: string } | null>(null);
  readonly companyUrl = signal<string>('');
  readonly vulnerabilities = signal<Vulnerability[]>([]);
  readonly isLoading = signal<boolean>(false);
  
  readonly stats = computed(() => {
    const vulns = this.vulnerabilities();
    return {
      total: vulns.length,
      critical: vulns.filter(v => v.severity === 'Critical').length,
      high: vulns.filter(v => v.severity === 'High').length,
      medium: vulns.filter(v => v.severity === 'Medium').length,
      low: vulns.filter(v => v.severity === 'Low').length
    };
  });

  // دالة Login المحدثة والمصححة
  login(email: string, name: string) {
    this.user.set({ name, email });
    this.router.navigate(['/result']);
  }

  startScan(url: string) {
    this.companyUrl.set(url);
    this.isLoading.set(true);
    setTimeout(() => {
      this.vulnerabilities.set(this.generateMockData());
      this.isLoading.set(false);
    }, 2500);
  }

  reset() {
    this.companyUrl.set('');
    this.vulnerabilities.set([]);
    this.isLoading.set(false);
  }

  logout() {
    this.reset();
    this.user.set(null);
    this.router.navigate(['/']);
  }

  private generateMockData(): Vulnerability[] {
    return [
      { id: '1', name: 'SQL Injection (Blind)', description: 'The application vulnerability allows an attacker to interfere with the queries that an application makes to its database.', severity: 'Critical', cveId: 'CVE-2024-3891', discoveredAt: new Date().toLocaleDateString() },
      { id: '2', name: 'Cross-Site Scripting (Reflected)', description: 'Reflected XSS arises when an application receives data in an HTTP request.', severity: 'High', cveId: 'CVE-2024-1022', discoveredAt: new Date().toLocaleDateString() },
      { id: '3', name: 'Insecure Direct Object Reference', description: 'The application does not properly validate that the user is authorized to access the specific resource ID requested.', severity: 'High', cveId: 'CVE-2023-9912', discoveredAt: new Date().toLocaleDateString() },
      { id: '4', name: 'Missing Security Headers', description: 'The web server response is missing crucial security headers like Content-Security-Policy.', severity: 'Low', cveId: 'N/A', discoveredAt: new Date().toLocaleDateString() },
      { id: '5', name: 'Outdated SSL/TLS Protocol', description: 'The server supports TLS 1.0 or 1.1 which are considered deprecated.', severity: 'Medium', cveId: 'N/A', discoveredAt: new Date().toLocaleDateString() },
      { id: '6', name: 'Admin Panel Exposure', description: 'The administrative interface is accessible from the public internet without IP restriction.', severity: 'Critical', cveId: 'CVE-2024-5501', discoveredAt: new Date().toLocaleDateString() }
    ];
  }
}