import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ScanService } from '../../../core/services/scan.service';
import { AuthService } from '../../../core/services/auth.service';
import imageCompression from 'browser-image-compression';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css', './../login.css']
})
export class SignUp {
  scanService = inject(ScanService);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  goToSignIn() {
    this.router.navigate(['/login/signin']);
  }

  goBack() {
    this.router.navigate(['/login/signin']);
  }

  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  signUpForm: FormGroup;

  countries = [
    { name: 'Egypt', code: '+20' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'UAE', code: '+971' },
    { name: 'USA', code: '+1' },
    { name: 'UK', code: '+44' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Jordan', code: '+962' },
    { name: 'Palestine', code: '+970' }
  ];

  //  متغيرات لحفظ القيم المختارة (للعرض والدمج)
  selectedCountryCode: string = '';
  selectedCountryName: string = '';

  // متغيرات للتحكم في ظهور الباسورد
  showPassword = false;
  showRePassword = false;

  selectedFileName: string = 'No file chosen';
  isCompressing: boolean = false;

  constructor(private _authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      fristName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      rePassword: ['', [Validators.required]], // حقل تأكيد الباسورد
      country: ['', Validators.required],
      // تم تعطيل الحقل افتراضياً حتى يختار الدولة
      location: [{ value: '', disabled: true }, Validators.required],
      // تم تعديل الفاليديتور ليقبل الأرقام فقط (لأن الرمز + سيتم دمجه لاحقاً)
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9\\s-]+$'), Validators.minLength(7)]],
      nationalID: ['', [Validators.required, Validators.minLength(10)]],
      age: ['', [Validators.required, Validators.min(21)]],
      image: [null],
      agreement: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator }); // إضافة الـ Validator هنا للمجموعة كاملة
  }
  onCountryChange(event: any) {
    const selectedCode = event.target.value;
    // البحث عن الدولة المختارة
    const country = this.countries.find(c => c.code === selectedCode);

    if (country) {
      this.selectedCountryCode = country.code;
      this.selectedCountryName = country.name;

      // 🔥 تفعيل حقول الهاتف والموقع الآن
      this.signUpForm.get('phone')?.enable();
      this.signUpForm.get('location')?.enable();

      // (اختياري) تصفير الحقول لضمان عدم وجود بيانات قديمة
      // this.signUpForm.get('location')?.setValue('');
    }
  }


  // دالة التحقق من تطابق الباسورد
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const rePassword = control.get('rePassword');

    // إذا لم تكن الحقول موجودة بعد، لا تفعل شيئاً
    if (!password || !rePassword) return null;

    // إذا كان هناك اختلاف، نضع الخطأ على حقل rePassword نفسه
    if (password.value !== rePassword.value) {
      rePassword.setErrors({ ...rePassword.errors, mismatch: true });
    } else {
      // إذا تطابقوا، نقوم بإزالة خطأ mismatch مع الحفاظ على الأخطاء الأخرى إن وجدت
      if (rePassword.errors) {
        delete rePassword.errors['mismatch'];
        if (Object.keys(rePassword.errors).length === 0) {
          rePassword.setErrors(null);
        }
      }
    }
    return null;
  }

  get pass() { return this.signUpForm.get('password'); }

  hasLowerCase() { return /[a-z]/.test(this.pass?.value || ''); }
  hasUpperCase() { return /[A-Z]/.test(this.pass?.value || ''); }
  hasNumber() { return /\d/.test(this.pass?.value || ''); }
  hasSpecial() { return /[#@$!%*?&]/.test(this.pass?.value || ''); }
  hasMinLength() { return (this.pass?.value || '').length >= 8; }

  getFieldClass(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    if (!field || !field.touched) return 'field-default';
    if (field.valid) return 'field-valid';
    return 'field-invalid';
  }

  getCheckboxClass(): string {
    const field = this.signUpForm.get('agreement');
    if (field?.value === true) return 'checkbox-valid';
    if (field?.invalid && field?.touched) return 'checkbox-invalid';
    return 'checkbox-default';
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // ضغط الصورة قبل حفظها في الفورم عشان نوفر وقت الرفع ومساحة السيرفر
      const options = {
        maxSizeMB: 1,          // أقصى حجم للصورة بعد الضغط: 1 ميجا
        maxWidthOrHeight: 1920, // أقصى عرض أو ارتفاع بالبكسل
        useWebWorker: true      // استخدام Web Worker عشان الضغط ميعلقش الصفحة
      };

      try {
        this.isCompressing = true;
        this.selectedFileName = 'Compressing image...';
        const compressedFile = await imageCompression(file, options);
        
        // 🔥 إنشاء File جديد بالاسم الأصلي لضمان وجود امتداد (.jpg, .png...)
        const finalFile = new File([compressedFile], file.name, { type: file.type });
        
        this.signUpForm.patchValue({ image: finalFile });
        this.selectedFileName = file.name;
        this.isCompressing = false;
      } catch (error) {
        console.error('Image compression failed, using original:', error);
        this.signUpForm.patchValue({ image: file });
        this.selectedFileName = file.name;
        this.isCompressing = false;
      }
    } else {
      this.signUpForm.patchValue({ image: null });
      this.selectedFileName = 'No file chosen';
    }
  }

  isLoading: boolean = false;

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    // دمج البيانات هنا قبل الإرسال (مهم جداً للباك إند)
    const cleanPhone = this.signUpForm.value.phone ? this.signUpForm.value.phone.replace(/[\s-]/g, '') : '';
    const fullPhone = this.selectedCountryCode + cleanPhone;
    const fullLocation = this.selectedCountryName + ', ' + this.signUpForm.value.location;
    // نرسل البيانات (بدون rePassword لأنه غير مطلوب في الباك إند عادة)
    formData.append('fristName', this.signUpForm.value.fristName);
    formData.append('lastName', this.signUpForm.value.lastName);
    formData.append('email', this.signUpForm.value.email);
    formData.append('password', this.signUpForm.value.password);
    // إرسال القيم المدمجة بدلاً من القيم الخام
    formData.append('location', fullLocation);
    formData.append('phone', fullPhone);
    formData.append('nationalID', this.signUpForm.value.nationalID);
    formData.append('age', this.signUpForm.value.age);

    if (this.signUpForm.value.image) {
      // نستخدم الاسم المخزن للتأكيد على الامتداد
      const imageFile = this.signUpForm.value.image;
      formData.append('image', imageFile, this.selectedFileName);
    }

    this._authService.signup(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/login/verify'], {
          queryParams: { email: this.signUpForm.value.email }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Signup failed", err);
        // عرض رسالة خطأ لو الإيميل موجود
        if (err.error && err.error.message) {
          this.toastService.show(err.error.message, 'error');
        }
      }
    });
  }
}