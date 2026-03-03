import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Navbar } from "../home/navbar/navbar";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  isEditMode: boolean = false;
  userId: string = ''; 
  user: any = {}; 
  showPassword = false;
  showConfirmPassword = false;
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private _router:Router,
    private fb: FormBuilder,
    private userService: UserService,
    private _authService:AuthService
  ) {

    this.profileForm = this.fb.group({
      fristName: ['', Validators.required], 
      lastName: ['', Validators.required],
      password: ['', [Validators.pattern(this.passwordRegex), Validators.minLength(0)]],
      confirmPassword: [''],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]+$')]],
    }, { validators: this.passwordMatchValidator,
       updateOn: 'change'});
  }
  
    get pass() { return this.profileForm.get('password'); }
  hasLowerCase() { return /[a-z]/.test(this.pass?.value || ''); }
  hasUpperCase() { return /[A-Z]/.test(this.pass?.value || ''); }
  hasNumber() { return /\d/.test(this.pass?.value || ''); }
  hasSpecial() { return /[@$!%*?&]/.test(this.pass?.value || ''); }
  hasMinLength() { return (this.pass?.value || '').length >= 8; }


  ngOnInit(): void {

    this.userIdByToken()




    this.loadUserData();
  }



  token:any=''

  userIdByToken(){
    this.token = this._authService.getToken() 
    if(this.token){
      this.token = jwtDecode(this.token)
      this.userId = this.token.id
    }
  }

  loadUserData() {
    this.userService.getUser(this.userId).subscribe({
      next: (res: any) => {
        this.user = res.data || res; 
        
        
        this.profileForm.patchValue({
          fristName: this.user.fristName,
          lastName: this.user.lastName,
          location: this.user.location,
          phone: this.user.phone,
          password: '' 
        });
      },
      error: (err) => console.error('Failed to load user', err)
    });
  }

  enableEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.profileForm.patchValue(this.user); 
    this.profileForm.get('password')?.setValue('');
    this.profileForm.get('confirmPassword')?.setValue('');
  }

  passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword');

  if (!password && !confirmPassword?.value) {
    confirmPassword?.setErrors(null);
    return null;
  }

  if (password !== confirmPassword?.value) {
    confirmPassword?.setErrors({ mismatch: true });
    return { mismatch: true };
  } 

  confirmPassword?.setErrors(null);
  return null;
}

togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formData = { ...this.profileForm.value };
    
    delete formData.confirmPassword;

    if (!formData.password) {
      delete formData.password;
    }

    this.userService.updateUser(this.userId, formData).subscribe({
      next: (res) => {
        this.user = { ...this.user, ...formData };
        this.isEditMode = false; 
        this.profileForm.get('confirmPassword')?.setValue('');
      },
      error: (err) => {
        alert('error updating profile');
        console.error(err);
      }
    });
  }
  routehome(){
    this._router.navigate(['']);
  }
}