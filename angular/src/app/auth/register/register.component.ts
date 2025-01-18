import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.services';
import { UserInterface } from '@models/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm
  errorMessage = null
  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    const baseUrl = environment.apiUrl;
    this.http.post<UserInterface>(`${baseUrl}/users/signup`, {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    })
    .subscribe({
      next: (response)=>{
        const token = response.token;
        this.authService.setToken(token);
        this.authService.$currentUser.next(response.username);
        this.router.navigateByUrl('/');
      },
      error: (err)=>{
        this.errorMessage = err.error.message;
      }
    })
  }
}
