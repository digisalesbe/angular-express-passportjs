import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  username: string = ''

  constructor(private authService: AuthService, private router: Router){
    this.authService.$currentUser.subscribe((val)=>{
      if(val) this.username = val;
    })
  }

  logout(){
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }

}
