export interface Vulnerability {
    _id?: string;  
  
    name: string;
    description: string;
    smallDescription?: string;
  
    date: string | Date;  
  
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  
    isActive?: boolean;  
  
    scriptFile?: string;
  
}