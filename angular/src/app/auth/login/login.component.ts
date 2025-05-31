import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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
  loading: boolean = false;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    // Check if you are still logged in
    if ( this.authService.isLoggedIn() ) {
      this.router.navigateByUrl('/dashboard');
    } else {
      // Check for username in URL parameters
      this.route.queryParams.subscribe(params => {
        if (params['username']) {
          this.loginForm.patchValue({ username: params['username'] });
          this.errorMessage  = 'This username already exists. Please log in.';
        }
      });
    }
    // Ensure form is initialized properly
    console.log("Form Initialized", this.loginForm.value);
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.loading = true;
    const baseUrl = environment.apiUrl;

    this.http.post<UserInterface>(`${baseUrl}/auth/login`, this.loginForm.value)
    .subscribe({
      next: (response)=>{
        this.loading = false;
          
        if (response.username && response.token) {
          // Login successful
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
      error: (err)=>{
        this.errorMessage = err.error?.message || 'Login failed';
      }
    })
  }
  
}
