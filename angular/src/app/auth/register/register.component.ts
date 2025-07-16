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
    // Check if you are still logged in
    if ( this.authService.isLoggedIn() ) {
      this.router.navigateByUrl('/dashboard');
    }
    // Ensure form is initialized properly
    console.log("Form Initialized", this.registerForm.value);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.loading = true;

    this.http.post<ApiResponseInterface>(`${environment.apiUrl}/auth/signup`, this.registerForm.value)
    .subscribe({
      next: (response)=>{
        this.loading = false;

        // Check if response indicates a redirect is needed (user already exists)
        if (response.redirect && response.url) {
          this.router.navigateByUrl(response.url);
          return;
        }

        this.errorMessage = response.message;
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
