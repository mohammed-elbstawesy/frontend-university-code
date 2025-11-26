import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styles: []
})
export class Users {
  
  pendingUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Security Analyst', requested: '2 hours ago', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Penetration Tester', requested: '5 hours ago', photo: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'DevOps Engineer', requested: '1 day ago', photo: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Security Manager', requested: '2 days ago', photo: 'https://i.pravatar.cc/150?img=9' }
  ];

  approve(id: number) {
    const user = this.pendingUsers.find(u => u.id === id);
    if (user) {
        if(confirm(`Approve ${user.name}?`)) {
            this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
            alert(`✅ User ${user.name} has been approved!`);
        }
    }
  }

  reject(id: number) {
    const user = this.pendingUsers.find(u => u.id === id);
    if (user) {
        if(confirm(`Reject ${user.name}?`)) {
            this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
            alert(`❌ User ${user.name} has been rejected.`);
        }
    }
  }
}