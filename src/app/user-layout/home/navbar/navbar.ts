import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isMenuOpen: boolean = false;
  user: any = null;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService 
  ) {}
  ngOnInit(): void {
    if (this.islogin) {
      this.getUserData();
    }
  }

  getUserData() {
    const token = this._authService.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      this._userService.getUser(decoded.id).subscribe({
        next: (res: any) => {
          this.user = res.data || res;
        },
        error: (err) => console.error(err)
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

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
    this._router.navigate(['']);

  }

  routeAdmin(){
    this._router.navigate(['/dashboard']);
    this.isMenuOpen = false;
  }
  routelogin(){
    this._router.navigate(['/login']);
  }

  routeUrlUser(){
    this._router.navigate(['/user-urls'])

  }

  routeProfile(){
  this._router.navigate(['/profile']);
  this.isMenuOpen = false;
  }



}