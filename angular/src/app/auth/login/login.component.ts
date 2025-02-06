import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.services';
import { UserInterface } from '@models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Ensure form is initialized properly
    console.log("Form Initialized", this.loginForm.value);
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    const baseUrl = environment.apiUrl;

    this.http.post<UserInterface>(`${baseUrl}/auth/login`, this.loginForm.value)
    .subscribe({
      next: (response)=>{
        const token = response.token;
        this.authService.setToken(token);

        // Set the full user data in the AuthService
        const user = {
          username: response.username,
          token: token
        };
        this.authService.setCurrentUser(user);

        this.router.navigateByUrl('/dashboard');
      },
      error: (err)=>{
        this.errorMessage = err.error.message;
      }
    })
  }

}
