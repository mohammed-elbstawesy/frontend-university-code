import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';
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
  constructor(private _userService: UserService, private toastService: ToastService) { }
  allUsersCount: number = 0;
  users: User[] = []
  isUserModalOpen: boolean = false;
  selectedUser: User | null = null;

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

  closeUserModal() {
    this.isUserModalOpen = false;
    this.selectedUser = null;
    document.body.style.overflow = 'auto';
  }

  delete(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId); // نجد المستخدم
    if (confirm(`you are sure to stop ${this.users.find(u => u._id === userId)?.fristName} account's ?`)) {
      this._userService.editUserStatus(userId, { userActive: 'notActive', userPending: 'accepted', fristName: user?.fristName })
        .subscribe({
          next: updated => {
            // alert(`User updated: ${updated.email}`);
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  restore(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    const user = this.users.find(u => u._id === userId);
    if (confirm(`you are sure to restore ${this.users.find(u => u._id === userId)?.fristName} account's ?`)) {
      this._userService.editUserStatus(userId, { userActive: 'active', fristName: user?.fristName })
        .subscribe({
          next: updated => {
            // alert(`User updated: ${updated.email}`);
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }


  toUser(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    if (confirm(`you are sure to change ${this.users.find(u => u._id === userId)?.fristName} account's to be a user?`)) {
      this._userService.editUserStatus(userId, { role: 'user' })
        .subscribe({
          next: updated => {
            // alert(`User updated: ${updated.email}`);
            this.ngOnInit();
          },
          error: err => {
            console.error(err);
            this.toastService.show('Failed to update user', 'error');
          }
        });
    }
  }

  toAdmin(userId?: string) {
    if (!userId) return this.toastService.show('User id missing', 'error');
    if (confirm(`you are sure to change ${this.users.find(u => u._id === userId)?.fristName} account's to be an admin?`)) {
      this._userService.editUserStatus(userId, { role: 'admin' })
        .subscribe({
          next: () => {
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