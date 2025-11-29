export interface Auth {
    token: string;
  } 



  export interface User {
    _id?: string;           
    fristName: string;       
    lastName: string;
  
    email: string;
    password?: string;     
  
    role: 'user' | 'admin';  
    isAdmin: boolean;
  
    location: string;
    phone: string;
    age: number;
  
    nationalID: number;
    image: string;
  
    userActive: 'active' | 'notActive';
    userPending: 'pending' | 'accepted';
  
  }
  