import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stats } from '../../stats/stats';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, Stats],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class Overview { }