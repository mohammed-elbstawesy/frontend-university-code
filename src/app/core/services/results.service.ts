import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ScanReport } from '../models/results.model'; // استدعاء الموديل الجديد
import { ApiResponse } from '../models/apiResponse.model'; // تأكد من المسار

@Injectable({
  providedIn: 'root',
})
export class ResultsService {

  constructor(private _http: HttpClient) {}
  
  // تأكد أن المسار الأساسي صحيح حسب الباك إند
  // غالباً في routes.js انت معرف الراوتر تحت /api/results/
  url = environment.apiUrl + 'results/'; 

  // --- 1. بدء فحص جديد ---
  // Backend Route: POST /api/results/scan-all
  runNewScan(urlId: string): Observable<any> {
    // Backend expects: req.body.urlId
    const body = { urlId: urlId }; 
    return this._http.post(`${this.url}scan-all`, body);
  }


  
  // --- 2. جلب تاريخ الفحوصات لرابط معين ---
  // Backend Route: GET /api/results/url/:id/reports
  getReportsByUrlId(urlId: string | number): Observable<ScanReport[]> {
    return this._http.get<ApiResponse<ScanReport[]>>(`${this.url}url/${urlId}/reports`)
      .pipe(
        map(resp => resp.data || []) 
      );
  }

  // --- 3. جلب تفاصيل تقرير محدد (اختياري لو هتعمل صفحة تفاصيل) ---
  // Backend Route: GET /api/results/report/:reportId
  getReportById(reportId: string): Observable<ScanReport> {
    return this._http.get<{ data: ScanReport }>(`${this.url}report/${reportId}`)
      .pipe(
        map(response => response.data)
      );
  }


  // داخل results.service.ts

  // دالة جديدة لجلب كل التقارير للإحصائيات
  getAllReports(): Observable<ScanReport[]> {
    // افترضنا أن عندك Endpoint في الباك إند اسمه get-all-results أو مشابه
    // لو مش موجود، ممكن تستخدم getResultsByUrlId لو عايز احصائيات لرابط معين
    // لكن للإحصائيات العامة، يفضل يكون عندك في الباك إند: router.get('/', controller.getAllResults)
    
    return this._http.get<ScanReport[]>(this.url); 
  }
}