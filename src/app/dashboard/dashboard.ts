import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    Navbar,
    Header
  ],
  templateUrl: './dashboard.html',
  styles: []
})
export class Dashboard {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}