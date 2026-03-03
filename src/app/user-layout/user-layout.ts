import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
        <router-outlet></router-outlet>
    </div>
  `
})
export class UserLayout { }