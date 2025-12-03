import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private _authService:AuthService,private _router: Router){}

get isadmin(): boolean {
    return this._authService.getRole() === 'admin';
  }

  get islogin(): boolean {
    return this._authService.getToken() !==null;
  }


  logout() {   
    this._authService.logout()
    localStorage.removeItem('token');
    localStorage.removeItem('pendingData');
    window.location.reload();
  }

  routeAdmin(){
    this._router.navigate(['/dashboard']);
  }
  routelogin(){
    this._router.navigate(['/login']);

  }

  routeProfile(){
  this._router.navigate(['/profile']);
  }



}