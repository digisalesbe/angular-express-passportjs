import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.services';
import { UserInterface } from '@models/user.interface';
import { ApiResponseInterface } from '@models/apiresponse.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  errorMessage: string = '';
  loading: boolean = false;

  constructor( 
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    // Ensure form is initialized properly
    console.log("Form Initialized", this.registerForm.value);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.loading = true;
    const baseUrl = environment.apiUrl;

    this.http.post<ApiResponseInterface>(`${baseUrl}/auth/signup`, this.registerForm.value)
    .subscribe({
      next: (response)=>{
        this.loading = false;

        // Check if response indicates a redirect is needed (user already exists)
        if (response.redirect && response.url) {
          this.router.navigateByUrl(response.url);
          return;
        }

        // Make sure username and token exist before proceeding
        if (response.username && response.token) {
          // Normal successful registration flow
          const token = response.token;
          this.authService.setToken(token);

          // Set the full user data in the AuthService
          const user: UserInterface = {
            username: response.username,
            token: token
          };
          this.authService.setCurrentUser(user);
            
          this.router.navigateByUrl('/dashboard');
        } else {
          // Handle unexpected response format
          this.errorMessage = 'Invalid server response';
        }
      },
      error: (err) => {
        this.loading = false;
          
        // Handle the redirect case for existing users (status 409)
        if (err.status === 409 && err.error?.redirect && err.error?.url) {
          this.router.navigateByUrl(err.error.url);
          return;
        }
          
        // Handle normal errors
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    })
  }
}
