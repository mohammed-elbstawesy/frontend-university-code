import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styles: []
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
}