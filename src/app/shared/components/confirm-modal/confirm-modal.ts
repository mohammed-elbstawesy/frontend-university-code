import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService, ConfirmOptions } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css'
})
export class ConfirmModal implements OnInit {
  private confirmService = inject(ConfirmService);
  
  isOpen = false;
  options: ConfirmOptions = { title: '', message: '' };
  private currentResolver: ((result: boolean) => void) | null = null;

  ngOnInit() {
    this.confirmService.confirm$.subscribe(data => {
      this.options = data.options;
      this.currentResolver = data.resolve;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    });
  }

  handleConfirm() {
    this.close(true);
  }

  handleCancel() {
    this.close(false);
  }

  private close(result: boolean) {
    this.isOpen = false;
    document.body.style.overflow = 'auto';
    if (this.currentResolver) {
      this.currentResolver(result);
      this.currentResolver = null;
    }
  }
}
