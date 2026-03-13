import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmSubject = new Subject<{ options: ConfirmOptions, resolve: (result: boolean) => void }>();
  confirm$ = this.confirmSubject.asObservable();

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmSubject.next({ options, resolve });
    });
  }

  // Helper for quick confirmations
  ask(message: string, type: 'danger' | 'warning' | 'info' | 'success' = 'warning'): Promise<boolean> {
    return this.confirm({
      title: 'Confirmation',
      message,
      type
    });
  }
}
