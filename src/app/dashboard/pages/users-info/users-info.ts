import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';

@Component({
  selector: 'app-users-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-info.html',
  styles: []
})
export class UsersInfo implements OnInit {
constructor(private _userService:UserService){}
allUsersCount: number = 0;
users :User[]=[]


  // approvedUsers = [
  //   { id: 1, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'Active', lastActive: '5 min ago' },
  //   { id: 2, name: 'Bob Wilson', email: 'bob@example.com', role: 'Security Analyst', status: 'Active', lastActive: '1 hour ago' },
  //   { id: 3, name: 'Charlie Taylor', email: 'charlie@example.com', role: 'Developer', status: 'Active', lastActive: '3 hours ago' },
  //   { id: 4, name: 'Diana Martinez', email: 'diana@example.com', role: 'Penetration Tester', status: 'Active', lastActive: '1 day ago' }
  // ];

  // edit(id?: string) {
  //   const user = this.users.find(u => u._id === id);
  //   alert(`✏️ Editing user: ${user?.fristName } ${user?.lastName}`);
  // }

  // delete(id?: string) {
  //   const user = this.users.find(u => u._id === id);
  //   if (user) {
  //       if (confirm(`Delete user ${user.fristName}?`)) {
  //           // this.users = this.users.filter(u => u._id !== id);
  //           this._userService.editUserStatus(id!, { userActive: 'notActive' }).subscribe({
  //               next: (res) => {
  //                   console.log('User deleted:', res);
  //                   this.users = this.users.filter(u => u._id !== id);
  //               },
  //               error: (err) => console.error('Error deleting user:', err)
  //           })
  //           alert(`🗑️ User ${user.fristName} deleted.`);
  //       }
  //   }
  // }

  delete(userId?: string) {
    if (!userId) return alert('User id missing');
    if (confirm(`you are sure to stop ${this.users.find(u => u._id === userId)?.fristName} account's ?` )) {
    this._userService.editUserStatus(userId, { userActive: 'notActive', userPending: 'accepted' })
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
    if (confirm(`you are sure to restore ${this.users.find(u => u._id === userId)?.fristName} account's ?` )) {
    this._userService.editUserStatus(userId, { userActive: 'active' })
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
        console.log(this.users);
        
        console.log('All users:',res);
      },
        error:(err)=>console.error('Error fetching users:',err)
    }
  );

    
  }
}