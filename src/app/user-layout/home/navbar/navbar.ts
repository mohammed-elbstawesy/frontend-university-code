import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  activeSection: string = 'hero';
  isMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  user: any = null;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService
  ) { }
  ngOnInit(): void {
    if (this._authService.isTokenExpired()) {
      this.logout();
      return;
    }
    if (this.islogin) {
      this.getUserData();
    }
  }
  cheackuser() {
    return this.user?.role === 'admin';
  }
  getUserData() {
    const token = this._authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this._userService.getUser(decoded.id).subscribe({
          next: (res: any) => {
            this.user = res.data || res;
          },
          error: (err) => {
            console.error(err);
            if (err.status === 401 || err.status === 404) this.logout();
          }
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get isadmin(): boolean {
    return this._authService.getRole() === 'admin';
  }

  get islogin(): boolean {
    return this._authService.getToken() !== null;
  }


  logout() {
    this._authService.logout()
    localStorage.removeItem('token');
    localStorage.removeItem('pendingData');
    this._router.navigate(['']);
    this.user = null;

  }

  routeAdmin() {
    this._router.navigate(['/dashboard']);
    this.isMenuOpen = false;
  }
  routelogin() {
    this._router.navigate(['/login']);
  }

  routeUrlUser() {
    this._router.navigate(['/user-urls'])

  }

  routeProfile() {
    this._router.navigate(['/profile']);
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['hero', 'about', 'services', 'pricing'];
    let current = 'hero';

    if (window.scrollY < 100) {
      this.activeSection = 'hero';
      return;
    }

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const top = element.getBoundingClientRect().top;
        if (top <= window.innerHeight / 3) {
          current = section;
        }
      }
    }
    this.activeSection = current;
  }
}