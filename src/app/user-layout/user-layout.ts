import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
   
    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex flex-col">
        <router-outlet></router-outlet>
    </div>
  `
})
export class UserLayout {}