// export interface Url {
//     _id: string;
//     originalUrl: string;
//     user?: {
//       _id: string;
//       email: string;
//     };
//     createdAt: string;
//     updatedAt: string;
//     report?: string;
//   }
  


export interface Url {
  _id: string;
  originalUrl: string;
  user?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  report?: string;
  // الحقول الجديدة من الباك إند
  status?: 'UnScaned' | 'Scanning' | 'Finished' | 'Failed';
  severity?: 'High' | 'Low' | 'Medium' | 'Critical' | 'safe';
  numberOfvuln?: number;
}
  