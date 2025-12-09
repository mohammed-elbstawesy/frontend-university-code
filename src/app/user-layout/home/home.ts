import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ScanService } from '../../core/services/scan.service';
import { Navbar } from './navbar/navbar';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultsService } from '../../core/services/results.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, ReactiveFormsModule, Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  scanService = inject(ScanService);
  router = inject(Router);

  urlForm!: FormGroup;
  errorMessage: string = '';
  url: Url[] = [];
  /////////////////////////////////////////////////////validation regex
  readonly urlRegex =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
  ///////////////////////////////////////////////////////
  constructor(
    private _urlService: UrlService,
    private _authService: AuthService,
    private _scanService: ResultsService
  ) {}
  islogin: boolean = false;
  role: string = 'admin';
  ngOnInit() {
    this.islogin = this._authService.isLogin();
    this.role = this._authService.getRole() === 'admin' ? 'admin' : 'user';
    console.log('is login :' + this.islogin);
    // console.log('this admin :'+this.role);

    this.scanService.reset();

    this.urlForm = new FormGroup({
      originalUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(this.urlRegex),
      ]),
    });

    // this._urlService.getUrls().subscribe({
    //   next: (response: Url[]) => {
    //     this.url = response;
    //     console.log('URLs:', this.url);
    //   },
    //   error: (error) => console.error('Error fetching URLs:', error)
    // });
  }
  onSubmit() {
    if (this.urlForm.invalid) {
      this.errorMessage =
        'Please enter a valid domain (e.g. google.com or https://example.com)';
      return;
    }


    if (this.islogin) {
      const urlInput = this.urlForm.value.originalUrl;

      this._urlService.addUrl({ originalUrl: urlInput }).subscribe({
        next: (response) =>{ console.log('URL added successfully:', response)

          const url_name:string = response.originalUrl;
          

          this._scanService.runNewScan(url_name).subscribe({
            next: (response) => console.log('URL start scanning successfully'),
            error: (error) => console.error('Error scanning URL:', error),
          }
          )

        },
        error: (error) => console.error('Error adding URL:', error),
      });

      


      console.log('is login');
      if (this.islogin && this.role !== 'admin') {
        this.router.navigate(['/result']);
      }
    } else {
      localStorage.setItem('pendingData', this.urlForm.value.originalUrl);
      this.router.navigate(['/login']);
    }

    console.log('not login');

    this.errorMessage = '';

    // بدء الفحص
    // this.scanService.startScan(urlInput);

    // التوجيه لصفحة تسجيل الدخول
    if (this.islogin && this.role === 'admin') {
      this.router.navigate(['/dashboard']);
      // console.log('admin it me');
    } else if (this.islogin && this.role !== 'admin') {
      this.router.navigate(['/scanning-wait']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
