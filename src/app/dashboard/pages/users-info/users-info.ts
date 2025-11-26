import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-info.html',
  styles: []
})
export class UsersInfo {
  approvedUsers = [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'Active', lastActive: '5 min ago' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', role: 'Security Analyst', status: 'Active', lastActive: '1 hour ago' },
    { id: 3, name: 'Charlie Taylor', email: 'charlie@example.com', role: 'Developer', status: 'Active', lastActive: '3 hours ago' },
    { id: 4, name: 'Diana Martinez', email: 'diana@example.com', role: 'Penetration Tester', status: 'Active', lastActive: '1 day ago' }
  ];

  edit(id: number) {
    const user = this.approvedUsers.find(u => u.id === id);
    alert(`✏️ Editing user: ${user?.name}`);
  }

  delete(id: number) {
    const user = this.approvedUsers.find(u => u.id === id);
    if (user) {
        if (confirm(`Delete user ${user.name}?`)) {
            this.approvedUsers = this.approvedUsers.filter(u => u.id !== id);
            alert(`🗑️ User ${user.name} deleted.`);
        }
    }
  }
}