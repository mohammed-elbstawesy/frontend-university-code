import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-users-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-info.html',
  styles: []
})
export class UsersInfo implements OnInit {
constructor(private _userService:UserService){}
allUsersCount: number = 0;
users :User[]=[]
isUserModalOpen: boolean = false;
selectedUser: User | null = null;

roleFilter: string = 'all';   
statusFilter: string = 'all'; 
searchTerm: string = '';
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
    if (!userId) return alert('User id missing');
    const user = this.users.find(u => u._id === userId); // نجد المستخدم
    if (confirm(`you are sure to stop ${this.users.find(u => u._id === userId)?.fristName} account's ?` )) {
    this._userService.editUserStatus(userId, { userActive: 'notActive', userPending: 'accepted',fristName: user?.fristName })
      .subscribe({
        next: updated => {
          // alert(`User updated: ${updated.email}`);
          this.ngOnInit(); 
        },
        error: err => {
          console.error(err);
          alert('Failed to update user');
        }
      });
    }
  }

  restore(userId?: string) {
    if (!userId) return alert('User id missing');
    const user = this.users.find(u => u._id === userId);
    if (confirm(`you are sure to restore ${this.users.find(u => u._id === userId)?.fristName} account's ?` )) {
    this._userService.editUserStatus(userId, { userActive: 'active',fristName: user?.fristName })
      .subscribe({
        next: updated => {
          // alert(`User updated: ${updated.email}`);
          this.ngOnInit(); 
        },
        error: err => {
          console.error(err);
          alert('Failed to update user');
        }
      });
    }
  }


  toUser(userId?: string) {
    if (!userId) return alert('User id missing');
    if (confirm(`you are sure to change ${this.users.find(u => u._id === userId)?.fristName} account's to be a user?` )) {
    this._userService.editUserStatus(userId, { role: 'user' })
      .subscribe({
        next: updated => {
          // alert(`User updated: ${updated.email}`);
          this.ngOnInit(); 
        },
        error: err => {
          console.error(err);
          alert('Failed to update user');
        }
      });
    }
  }
  


  toAdmin(userId?: string) {
    if (!userId) return alert('User id missing');
    if (confirm(`you are sure to change ${this.users.find(u => u._id === userId)?.fristName} account's to be an admin?` )) {
    this._userService.editUserStatus(userId, { role: 'admin' })
      .subscribe({
        next: updated => {
          // alert(`User updated: ${updated.email}`);
          this.ngOnInit(); 
        },
        error: err => {
          console.error(err);
          alert('Failed to update user');
        }
      });
    }
  }


  ngOnInit(): void {

    this._userService.getAllUsers().subscribe({
      next:(res)=>{
        this.users=res;

        this.allUsersCount=res.length;
        // console.log(this.users);
        
        // console.log('All users:',res);
      },
        error:(err)=>console.error('Error fetching users:',err)
    }
  );

    
  }
}