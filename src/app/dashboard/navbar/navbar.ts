import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styles: []
})
export class Navbar {
  
  navItems = [
    { label: 'Dashboard', route: '/dashboard', iconPath: 'rect-icon' },
    { label: 'Approve Users', route: '/users', iconPath: 'user-check-icon' }, 
    { label: 'Users & Info', route: '/users-info', iconPath: 'users-icon' }, 
    { label: 'URLs', route: '/urls', iconPath: 'link-icon' },
    { label: 'Reports', route: '/reports', iconPath: 'file-text-icon' },
    { label: 'Vulnerabilities', route: '/vulnerabilities', iconPath: 'alert-circle-icon' },
    { label: 'logs', route: '/logs', iconPath: 'log-icon' }
  ];
}