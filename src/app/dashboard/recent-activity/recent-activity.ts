import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.html',
  styles: []
})
export class RecentActivity {
  activities = [
    { title: 'New vulnerability reported', time: '2 min ago', color: 'bg-[#ff003c] shadow-[0_0_8px_rgba(255,85,85,0.4)]' },
    { title: 'User approved: john@example.com', time: '15 min ago', color: 'bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.4)]' },
    { title: 'Report generated: Weekly Summary', time: '1 hour ago', color: 'bg-blue-500 shadow-[0_0_8px_rgba(91,141,239,0.4)]' },
    { title: 'URL added for scanning', time: '2 hours ago', color: 'bg-blue-500 shadow-[0_0_8px_rgba(91,141,239,0.4)]' }
  ];
}