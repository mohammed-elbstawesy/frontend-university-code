import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/users.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styles: []
})
export class Users implements OnInit {
    constructor(private _userService:UserService){}
    users :User[]=[]
    allUsersCount: number = 0;
    isImageModalOpen: boolean = false;
    selectedImageUrl: string = '';
    
    pending(id?:String){
      return this.users.find(u => u._id === id)?.userPending ==='pending'
    }
    




    acceptPending(userId?: string) {
      if (!userId) return alert('User id missing');
      if (confirm(`you are sure to accept ${this.users.find(u => u._id === userId)?.fristName} account's ?` )) {
      this._userService.editUserStatus(userId, { userPending: 'accepted' })
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




  // pendingUsers = [
  //   { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Security Analyst', requested: '2 hours ago', photo: 'https://i.pravatar.cc/150?img=1' },
  //   { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Penetration Tester', requested: '5 hours ago', photo: 'https://i.pravatar.cc/150?img=5' },
  //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'DevOps Engineer', requested: '1 day ago', photo: 'https://i.pravatar.cc/150?img=3' },
  //   { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Security Manager', requested: '2 days ago', photo: 'https://i.pravatar.cc/150?img=9' }
  // ];

  // approve(id: number) {
  //   const user = this.pendingUsers.find(u => u.id === id);
  //   if (user) {
  //       if(confirm(`Approve ${user.name}?`)) {
  //           this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
  //           alert(`✅ User ${user.name} has been approved!`);
  //       }
  //   }
  // }

  // reject(id: number) {
  //   const user = this.pendingUsers.find(u => u.id === id);
  //   if (user) {
  //       if(confirm(`Reject ${user.name}?`)) {
  //           this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
  //           alert(`❌ User ${user.name} has been rejected.`);
  //       }
  //   }
  // }



  ngOnInit() {
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