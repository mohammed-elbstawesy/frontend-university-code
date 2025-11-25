import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet],
  // القالب يحتوي فقط على مخرج الراوتر
  template: `<router-outlet></router-outlet>`, 
  styles: []
})
export class Login {}