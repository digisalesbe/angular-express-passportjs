import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  errorMessage: string = '';

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

    const baseUrl = environment.apiUrl;

    this.http.post<UserInterface>(`${baseUrl}/auth/signup`, this.registerForm.value)
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
