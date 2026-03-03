import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private _userService: UserService) { }
  users: User[] = []
  allUsersCount: number = 0;
  isImageModalOpen: boolean = false;
  selectedImageUrl: string = '';

  pending(id?: String) {
    return this.users.find(u => u._id === id)?.userPending === 'pending'
  }





  acceptPending(userId?: string) {
    if (!userId) return alert('User id missing');
    if (confirm(`you are sure to accept ${this.users.find(u => u._id === userId)?.fristName} account's ?`)) {
      this._userService.editUserStatus(userId, { userPending: 'accepted' })
        .subscribe({
          next: () => {
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            alert('Failed to update user');
          }
        });
    }
  }
  openImageModal(imagePath: string) {
    if (imagePath) {
      // نكون الرابط الكامل هنا
      this.selectedImageUrl = 'http://localhost:3000/' + imagePath;
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