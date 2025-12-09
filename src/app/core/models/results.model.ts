// export interface results {
//     _id: string;
//     url: {
//       _id: string;
//     };
//     vulnerability:{
//       _id: string;
//     }
//     detected: boolean;
//   }



// src/app/models/results.model.ts

// export interface ScanDetail {
//   vulnerabilityId: string;
//   vulnerabilityName: string;
//   severity: 'safe' | 'Low' | 'Medium' | 'High' | 'Critical';
//   isDetected: boolean;
//   technicalDetail?: any; // تفاصيل البايثون (اختياري)
// }

// export interface ScanReport {
//   _id: string;
//   url: string | any; // قد يكون نص أو كائن (Populated)
//   scanDate: Date;
//   summary: {
//     totalVulnerabilities: number;
//     highestSeverity: string;
//   };
  // details: ScanDetail[]; // المصفوفة التي سنعرضها في الجدول
//   createdAt?: Date;
//   updatedAt?: Date;
// }




export interface ScanDetail {
  vulnerabilityId: string;
  vulnerabilityName: string;
  severity: 'safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  isDetected: boolean;
  technicalDetail?: any;
}

export interface ScanReport {
  _id: string;
  url: string | any;
  scanDate: Date;
  summary: {
    totalVulnerabilities: number;
    highestSeverity: string;
  };
  details: ScanDetail[]; // المصفوفة التي سنستخرج منها النتائج
  createdAt?: Date;
  updatedAt?: Date;
}