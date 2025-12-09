import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsService } from '../../core/services/results.service';

@Component({
  selector: 'app-scaning-wait',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scaning-wait.html',
  styleUrl: './scaning-wait.css',
})
export class ScaningWait implements OnInit, OnDestroy {
  
  progress: number = 0;
  statusMessage: string = 'INITIALIZING_SECURITY_PROTOCOLS';
  targetUrlId: string = '';
  private progressInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _resultService: ResultsService
  ) {}

  ngOnInit() {
    // 1. جلب الـ ID من الرابط
    this.targetUrlId = this.route.snapshot.paramMap.get('id') || '';

    if (this.targetUrlId) {
      this.startSimulation(); // تشغيل الأنيميشن الوهمي
      this.startActualScan(); // تشغيل الفحص الحقيقي
    } else {
      // لو مفيش ID نرجع للصفحة الرئيسية
      this.router.navigate(['/']);
    }
  }

  // --- دالة الفحص الحقيقي ---
  startActualScan() {
    this._resultService.runNewScan(this.targetUrlId).subscribe({
      next: (res) => {
        // الفحص انتهى بنجاح من الباك إند
        this.completeProgress(); // نقفل الشريط 100%
        
        // ننتظر 1.5 ثانية عشان اليوزر يشوف الـ 100% ورسالة النجاح
        setTimeout(() => {
          this.router.navigate(['/result', this.targetUrlId]);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.statusMessage = 'CONNECTION_FAILED_RETRYING';
        this.stopSimulation();
      }
    });
  }

  // --- دالة محاكاة الشريط (عشان يبقى شكله واقعي) ---
  startSimulation() {
    this.progress = 0;
    
    this.progressInterval = setInterval(() => {
      // المرحلة الأولى: سريع (0% - 30%)
      if (this.progress < 30) {
        this.progress += Math.random() * 5; 
        this.statusMessage = 'ANALYZING_SERVER_INFRASTRUCTURE';
      } 
      // المرحلة الثانية: متوسط (30% - 60%)
      else if (this.progress < 60) {
        this.progress += Math.random() * 2; 
        this.statusMessage = 'RUNNING_VULNERABILITY_SCRIPTS';
      } 
      // المرحلة الثالثة: بطيء (60% - 85%)
      else if (this.progress < 85) {
        this.progress += Math.random() * 0.5; 
        this.statusMessage = 'GENERATING_SECURITY_REPORT';
      }
      
      // وقوف إجباري عند 90% لحد ما الباك إند يرد
      if (this.progress > 90) this.progress = 90;
      
      // تقريب الرقم لمنزلة عشرية واحدة
      this.progress = Math.round(this.progress * 10) / 10;
    }, 500); // تحديث كل نص ثانية
  }

  // دالة الإنهاء الفوري
  completeProgress() {
    this.stopSimulation();
    this.progress = 100;
    this.statusMessage = 'SCAN_COMPLETED_SUCCESSFULLY';
  }

  stopSimulation() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  ngOnDestroy() {
    this.stopSimulation();
  }
}