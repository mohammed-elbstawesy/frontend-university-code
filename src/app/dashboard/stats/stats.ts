import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vulnerability } from '../../core/models/vuln.model';
import { VulnService } from '../../core/services/vuln.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/users.model';
import { Url } from '../../core/models/url.model';
import { UrlService } from '../../core/services/url.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styles: []
})
export class Stats implements OnInit{
constructor(
  private _vulnService:VulnService,
  private _user:UserService,
  private _url:UrlService
  

){

}

  vuln :Vulnerability[]=[];
  users :User[]=[]
  urls :Url[]=[]
  numberOFvuln: number = 0;
  numberOFusers:number = 0;
  numberOFpending:number = 0;
  numberOFurls :number = 0;
  



  stats = [
    { label: 'Total Vulnerabilities', value: this.numberOFvuln, color: 'text-blue-500', bg: 'bg-blue-500/10', iconPath: 'M10 2L3 6V10C3 14.5 6.5 18.5 10 20C13.5 18.5 17 14.5 17 10V6L10 2Z' },
    { label: 'Pending Approval', value: this.numberOFpending, color: 'text-orange-500', bg: 'bg-orange-500/10', iconPath: 'M13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6Z M5 16C5 13.7909 6.79086 12 9 12H11C13.2091 12 15 13.7909 15 16V17H5V16Z' },
    { label: 'Users Accounts', value: this.numberOFusers, color: 'text-[#ff003c]', bg: 'bg-[#ff003c]/10', iconPath: 'M10 6V10M10 14H10.01M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z' },
    { label: 'Resolved', value: 89, color: 'text-green-500', bg: 'bg-green-500/10', iconPath: 'M5 10L8 13L15 6' },
    // { label: 'Tracked URLs', value: 45, color: 'text-purple-500', bg: 'bg-purple-500/10', iconPath: 'M8 12L12 8M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z' },
    { label: 'Tracked URLs', value: this.numberOFurls, color: 'text-green-500', bg: 'bg-green-500/10', iconPath: 'M5 10L8 13L15 6'  },
    { label: 'Reports Generated', value: 23, color: 'text-[#ff003c]', bg: 'bg-[#ff003c]/10', iconPath: 'M6 2H14C15.1 2 16 2.9 16 4V18L10 15L4 18V4C4 2.9 4.9 2 6 2Z' }
  ];


  ngOnInit() {



    this.numberOFvuln = 0;
    this._vulnService.getVuln().subscribe({
      next:(response)=>{
        this.vuln=response.data;
        this.numberOFvuln=this.vuln.length;
        this.stats[0].value= this.numberOFvuln;

        // console.log('Vulnerabilities:', this.vuln);
        console.log('Count:', this.vuln.length);
      },
      error:(error)=>console.error('Error fetching Vulnerabilities:',error)
    })
  



    this.numberOFusers=0;
    this.numberOFpending=0;
  this._user.getAllUsers().subscribe({
    next:(response)=>{
      this.users=response;
      this.numberOFpending = this.users.filter(u => (u.userPending || '').toLowerCase() === 'pending').length;
      this.numberOFusers=this.users.length;
      this.stats[2].value= this.numberOFusers;
      this.stats[1].value= this.numberOFpending;

      // console.log('users:', this.users);
      console.log('Count:', this.users.length);
      console.log('pending:', this.numberOFpending);
      
    },
    error:(error)=>console.error('Error fetching users:',error)
  })




  this.numberOFurls= 0;
this._url.getUrls().subscribe({
  next:(res)=>{
    this.urls = res
    this.numberOFurls = this.urls.length;
    this.stats[4].value=this.numberOFurls
    console.log('urls:', this.numberOFurls);


  },
  error:(error)=>console.error('Error fetching URLS:',error)

})


}



}