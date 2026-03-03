import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterOutlet, Navbar],
    templateUrl: './footer.component.html',
    styleUrls: ['../home.css']
})
export class FooterComponent { }
