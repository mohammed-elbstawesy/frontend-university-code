import { Component, inject, signal } from '@angular/core';
import { ScanService } from './core/services/scan.service';
import {  RouterOutlet } from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [ RouterOutlet],
})
export class App {
  protected readonly title = signal('frontend');
  scanService = inject(ScanService);

  urlInput: string = '';

  start() {
    if (!this.urlInput.trim()) return;
    this.scanService.startScan(this.urlInput);
  }

  reset() {
    this.scanService.reset();
    this.urlInput = '';
  }
}


