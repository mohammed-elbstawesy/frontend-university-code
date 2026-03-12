import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VulnService } from '../../../core/services/vuln.service';
import { Vulnerability } from '../../../core/models/vuln.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-vulnerabilities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vulnerabilities.html',
  styleUrls: ['./vulnerabilities.css']
})
export class Vulnerabilities implements OnInit {
  selectedFile: File | null = null;
  vulns: Vulnerability[] = [];
  searchTerm: string = '';
  severityFilter: string = 'all';
  statusFilter: string = 'all';

  // 🔥 متغيرات الـ Popup الجديدة
  isEditModalOpen: boolean = false;
  editingVuln: Vulnerability | null = null; // لتخزين نسخة من الثغرة أثناء التعديل

  constructor(private _vulnService: VulnService, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.fetchVulns();
  }

  goToAdd() {
    this.router.navigate(['/dashboard/vulnerabilities/add']);
  }

  fetchVulns() {
    this._vulnService.getVuln().subscribe({
      next: (response) => {
        this.vulns = response?.data || [];
      },
      error: (err) => console.error('Error fetching Vulnerabilities:', err)
    });
  }

  // 🔥 1. دالة فتح الـ Popup
  openEditModal(vuln: Vulnerability) {
    // بناخد نسخة طبق الأصل عشان التعديل ميبانش في الجدول غير لما ندوس حفظ
    this.editingVuln = JSON.parse(JSON.stringify(vuln));
    this.isEditModalOpen = true;
    document.body.style.overflow = 'hidden'; // منع السكرول في الخلفية
  }

  // 🔥 2. دالة غلق الـ Popup
  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingVuln = null;
    this.selectedFile = null; // 🔥 تصفير الملف
    document.body.style.overflow = 'auto';
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // 🔥 3. دالة حفظ التعديلات
  saveEdit() {
    if (!this.editingVuln || !this.editingVuln._id) return;

    // 🔥 استخدام FormData بدل الـ Object العادي
    const formData = new FormData();

    // إضافة البيانات النصية
    formData.append('name', this.editingVuln.name);
    formData.append('severity', this.editingVuln.severity);
    formData.append('description', this.editingVuln.description);
    formData.append('smallDescription', this.editingVuln.smallDescription || '');

    // 🔥 إضافة الملف فقط لو المستخدم اختار ملف جديد
    if (this.selectedFile) {
      formData.append('scriptFile', this.selectedFile);
    }

    // إرسال الـ FormData للسيرفس
    this._vulnService.editVulnerability(this.editingVuln._id, formData).subscribe({
      next: (res) => {
        // تحديث البيانات محلياً
        const index = this.vulns.findIndex(v => v._id === this.editingVuln?._id);
        if (index !== -1 && this.editingVuln) {
          // تحديث البيانات النصية
          this.vulns[index] = { ...this.editingVuln };

          // لو رفعنا ملف جديد، نحدث اسمه في العرض (اختياري)
          if (this.selectedFile) {
            this.vulns[index].scriptFile = this.selectedFile.name;
          }
        }
        this.toastService.show('Vulnerability "' + this.editingVuln?.name + '" updated successfully', 'success');

        this.closeEditModal();
        this.selectedFile = null; // تصفير الملف
      },
      error: (err) => {
        console.error('Error updating vulnerability:', err);
        this.toastService.show('Failed to update vulnerability', 'error');
      }
    });
  }

  // ... (باقي الجيترز والوظائف القديمة زي ما هي) ...
  get filteredVulns(): Vulnerability[] {
    return this.vulns.filter(v => {
      const q = this.searchTerm.trim().toLowerCase();
      const matchesSearch = !q ||
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.smallDescription && v.smallDescription.toLowerCase().includes(q));
      const sev = this.severityFilter.toLowerCase();
      const matchesSeverity = sev === 'all' || (v.severity && v.severity.toLowerCase() === sev);
      const status = this.statusFilter.toLowerCase();
      let matchesStatus = true;
      if (status !== 'all') {
        if (status === 'available') matchesStatus = v.isActive === true;
        else if (status === 'cancelled') matchesStatus = v.isActive === false;
      }
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }

  getSeverityClass(severity: string | undefined): string {
    const map: { [k: string]: string } = {
      'critical': 'badge-danger',
      'high': 'badge-warning',
      'medium': 'badge-info',
      'low': 'badge-info'
    };
    return map[(severity || '').toLowerCase()] || map['low'];
  }

  getStatusClass(isActive?: boolean): string {
    if (isActive === undefined) return 'badge-info';
    return isActive ? 'badge-warning' : 'badge-info';
  }

  getStatusDotClass(isActive?: boolean): string {
    if (isActive === undefined) return 'dot-indicator';
    return isActive ? 'dot-indicator dot-green-pulse' : 'dot-indicator dot-red';
  }

  toggleActive(vuln: Vulnerability) {
    if (!vuln._id) return;
    const newStatus = !vuln.isActive;
    const updateData: any = { isActive: newStatus };
    this._vulnService.editVulnerability(vuln._id, updateData).subscribe({
      next: (res) => { vuln.isActive = newStatus; },
      error: (err) => { console.error(err); }
    });
  }

  trackById(index: number, item: Vulnerability): string {
    return item._id ?? String(index);
  }
}