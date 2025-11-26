export interface Auth {
    token: string;
  } 



  export interface User {
    _id?: string;            // بيرجع من MongoDB تلقائيًا
    fristName: string;       // (لاحظ إنها frist في الـ backend)
    lastName: string;
  
    email: string;
    password?: string;       // بنخليها optional عشان مش بترجع في GET
  
    role: 'user' | 'admin';  // enum
    isAdmin: boolean;
  
    location: string;
    phone: string;
    age: number;
  
    nationalID: number;
    image: string;
  
    userActive: 'active' | 'notActive';
    userPending: 'pending' | 'accepted';
  
  }
  