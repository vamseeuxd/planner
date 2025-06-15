import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
signupForm: FormGroup;
  errorMessage: string | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid) {
      console.log('Form is invalid:', this.signupForm.errors);
      return;
    }

    const { email, password } = this.signupForm.value;
    try {
      await this.authService.signUp(email, password);
      this.snackBar.open('Account created successfully! Please log in.', 'Close', { duration: 5000 });
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Signup error:', error);
      this.snackBar.open(error.message, 'Close', { duration: 5000 });
    }
  }
}
