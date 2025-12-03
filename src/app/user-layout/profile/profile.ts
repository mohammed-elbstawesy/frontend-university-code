import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  isEditMode: boolean = false;
  userId: string = '674...'; // هنا لازم تجيب الـ ID الحقيقي لليوزر المسجل دخول
  user: any = {}; // لتخزين البيانات المعروضة

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // تهيئة الفورم
    this.profileForm = this.fb.group({
      fristName: ['', Validators.required], // لاحظ: fristName نفس الباك اند
      lastName: ['', Validators.required],
      location: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // مثال لفاليديشن أرقام فقط
      password: [''] // اختياري
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  // تحميل بيانات المستخدم من السيرفر
  loadUserData() {
    this.userService.getUser(this.userId).subscribe({
      next: (res: any) => {
        this.user = res.data || res; // حسب شكل الـ Response بتاعك
        // تحديث قيم الفورم بالبيانات اللي جت
        console.log('Res :'+this.user);
        
        this.profileForm.patchValue({
          fristName: this.user.fristName,
          lastName: this.user.lastName,
          location: this.user.location,
          phone: this.user.phone,
          password: '' // الباسورد دايما فاضي
        });
      },
      error: (err) => console.error('Failed to load user', err)
    });
  }

  // تفعيل وضع التعديل
  enableEdit() {
    this.isEditMode = true;
  }

  // إلغاء التعديل والعودة للبيانات الأصلية
  cancelEdit() {
    this.isEditMode = false;
    this.profileForm.patchValue(this.user); // استرجاع البيانات القديمة للفورم
    this.profileForm.get('password')?.setValue('');
  }

  // حفظ البيانات
  onSubmit() {
    if (this.profileForm.invalid) {
      alert('يرجى التأكد من صحة البيانات');
      return;
    }

    const formData = this.profileForm.value;
    
    // لو الباسورد فاضي، شيله من الأوبجكت عشان ميمسحش القديم في الداتابيز (رغم اننا عاملين حسابنا في الباك اند بس زيادة تأكيد)
    if (!formData.password) {
      delete formData.password;
    }

    this.userService.updateUser(this.userId, formData).subscribe({
      next: (res) => {
        alert('تم تحديث البيانات بنجاح');
        this.user = { ...this.user, ...formData }; // تحديث البيانات المعروضة فوراً
        this.isEditMode = false; // الخروج من وضع التعديل
      },
      error: (err) => {
        alert('حدث خطأ أثناء التحديث');
        console.error(err);
      }
    });
  }
}