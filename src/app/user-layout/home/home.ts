import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ScanService } from '../../core/services/scan.service';
import { Navbar } from './navbar/navbar';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar,ReactiveFormsModule,Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit { scanService = inject(ScanService);
  router = inject(Router);

  urlForm!: FormGroup;
  errorMessage: string = '';
  url: Url[] = [];

  constructor(private _urlService: UrlService) {}

  ngOnInit() {
    this.scanService.reset();

    this.urlForm = new FormGroup({
      originalUrl: new FormControl('', [Validators.required, Validators.minLength(4)])
    });

    this._urlService.getUrls().subscribe({
      next: (response: Url[]) => {
        this.url = response;
        console.log('URLs:', this.url);
      },
      error: (error) => console.error('Error fetching URLs:', error)
    });
  }

  onSubmit() {
    if (this.urlForm.invalid) {
      this.errorMessage = 'Please enter a valid domain';
      return;
    }

    const urlInput = this.urlForm.value.originalUrl;

    this.errorMessage = '';

    // بدء الفحص
    this.scanService.startScan(urlInput);
    

    this._urlService.addUrl({ originalUrl: urlInput }).subscribe({
      next: (response) => console.log('URL added successfully:', response),
      error: (error) => console.error('Error adding URL:', error)
    });

    // التوجيه لصفحة تسجيل الدخول
    this.router.navigate(['/login']);
  }
}