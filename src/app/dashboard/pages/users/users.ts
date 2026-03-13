import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { FallbackImageDirective } from '../../../shared/directives/fallback-image.directive';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FallbackImageDirective],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(
    private _userService: UserService, 
    private toastService: ToastService,
    private _confirm: ConfirmService
  ) { }
  users: User[] = []
  allUsersCount: number = 0;
  isImageModalOpen: boolean = false;
  selectedImageUrl: string = '';
  baseImageUrl: string = environment.apiUrl.replace('/api/', '/');

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    let path = imagePath.replace(/\\/g, '/');
    if (!path.startsWith('uploads/')) {
      path = 'uploads/' + path;
    }
    return this.baseImageUrl + path;
  }

  pending(id?: String) {
    return this.users.find(u => u._id === id)?.userPending === 'pending'
  }





  acceptPending(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    
    this._userService.editUserStatus(userId, { userPending: 'accepted' })
      .subscribe({
        next: () => {
          this.toastService.show('User accepted successfully!', 'success');
          this.ngOnInit();
        },
        error: err => {
          console.error(err);
          this.toastService.show('Failed to update user', 'error');
        }
      });
  }
  openImageModal(imagePath: string) {
    if (imagePath) {
      // نكون الرابط الكامل هنا
      this.selectedImageUrl = this.getImageUrl(imagePath);
      this.isImageModalOpen = true;
      document.body.style.overflow = 'hidden'; // منع السكرول الخلفي
    }
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
    document.body.style.overflow = 'auto'; // إعادة السكرول
  }


  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startPolling() {
    timer(0, 5000).pipe(
      switchMap(() => this._userService.getAllUsers()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.users = res;
        this.allUsersCount = res.length;
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }
}