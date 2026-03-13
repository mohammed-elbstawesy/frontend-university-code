import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';
import { ConfirmService } from '../../../core/services/confirm.service';
import { FormsModule } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FallbackImageDirective } from '../../../shared/directives/fallback-image.directive';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-users-info',
  standalone: true,
  imports: [CommonModule, FormsModule, FallbackImageDirective],
  templateUrl: './users-info.html',
  styleUrls: ['./users-info.css']
})
export class UsersInfo implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(
    private _userService: UserService, 
    private toastService: ToastService,
    private _confirm: ConfirmService
  ) { }
  allUsersCount: number = 0;
  users: User[] = []
  isUserModalOpen: boolean = false;
  selectedUser: User | null = null;
  isImageModalOpen: boolean = false;
  selectedImageUrl: string = '';

  roleFilter: string = 'all';
  statusFilter: string = 'all';
  searchTerm: string = '';

  baseImageUrl: string = environment.apiUrl.replace('/api/', '/');

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    let path = imagePath.replace(/\\/g, '/');
    if (!path.startsWith('uploads/')) {
      path = 'uploads/' + path;
    }
    return this.baseImageUrl + path;
  }
  get filteredUsers(): User[] {
    return this.users.filter(u => {
      // 1. منطق البحث (زي ما عملناه المرة اللي فاتت)
      const q = this.searchTerm.trim().toLowerCase();
      const matchesSearch = !q ||
        (u.fristName && u.fristName.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.nationalID && u.nationalID.toString().includes(q));

      // 2. منطق فلتر الرتبة (Role)
      const matchesRole = this.roleFilter === 'all' || u.role === this.roleFilter;

      // 3. منطق فلتر الحالة (Status)
      const matchesStatus = this.statusFilter === 'all' || u.userActive === this.statusFilter;

      // لازم التلاتة يتحققوا مع بعض
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  openUserModal(user: User) {
    this.selectedUser = user;
    this.isUserModalOpen = true;
    document.body.style.overflow = 'hidden'; // منع السكرول الخلفي
  }

  openImageModal(imagePath: string) {
    if (imagePath) {
      this.selectedImageUrl = this.getImageUrl(imagePath);
      this.isImageModalOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
    document.body.style.overflow = 'auto';
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    this.selectedUser = null;
    document.body.style.overflow = 'auto';
  }

  async delete(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId);
    
    const confirmed = await this._confirm.confirm({
      title: 'Stop Account',
      message: `Are you sure you want to stop ${user?.fristName}'s account?`,
      type: 'danger',
      confirmText: 'Stop Account'
    });

    if (confirmed) {
      this._userService.editUserStatus(userId, { userActive: 'notActive', userPending: 'accepted', fristName: user?.fristName })
        .subscribe({
          next: () => {
            this.toastService.show('Account stopped successfully', 'success');
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  async restore(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId);
    
    const confirmed = await this._confirm.confirm({
      title: 'Restore Account',
      message: `Are you sure you want to restore ${user?.fristName}'s account?`,
      type: 'success',
      confirmText: 'Restore'
    });

    if (confirmed) {
      this._userService.editUserStatus(userId, { userActive: 'active', fristName: user?.fristName })
        .subscribe({
          next: () => {
            this.toastService.show('Account restored successfully', 'success');
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  async toUser(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId);

    const confirmed = await this._confirm.confirm({
      title: 'Change Role',
      message: `Are you sure you want to change ${user?.fristName}'s account to be a user?`,
      type: 'warning',
      confirmText: 'Change to User'
    });

    if (confirmed) {
      this._userService.editUserStatus(userId, { role: 'user' })
        .subscribe({
          next: () => {
            this.toastService.show('Role changed to User', 'success');
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  async toAdmin(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId);

    const confirmed = await this._confirm.confirm({
      title: 'Promote to Admin',
      message: `Are you sure you want to change ${user?.fristName}'s account to be an admin?`,
      type: 'warning',
      confirmText: 'Promote to Admin'
    });

    if (confirmed) {
      this._userService.editUserStatus(userId, { role: 'admin' })
        .subscribe({
          next: () => {
            this.toastService.show('User promoted to Admin', 'success');
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  ngOnInit(): void {
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