import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickActions } from '../../quick-actions/quick-actions';
import { Stats } from '../../stats/stats';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, Stats, QuickActions],
  templateUrl: './overview.html',
  styles: []
})
export class Overview {}