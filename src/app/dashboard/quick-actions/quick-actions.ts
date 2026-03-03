import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [],
  templateUrl: './quick-actions.html',
  styleUrls: ['./quick-actions.css']
})
export class QuickActions {
  constructor(private router: Router) { }

  goTo(path: string) {
    this.router.navigate(['/dashboard/' + path]);
  }
}