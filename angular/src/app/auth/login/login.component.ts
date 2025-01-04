import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../../user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm
  errorMessage = null;

  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(): void {
    const baseUrl = environment.apiUrl;
    this.http.post<UserInterface>(`${baseUrl}/users/login`, {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
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
