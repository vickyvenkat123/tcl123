import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { ChangePasswordComponent } from 'src/app/Modules/Components/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: any;

  constructor(private router: Router, private dialog: MatDialog, private loginService: LoginService) { }

  ngOnInit(): void {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || '{}');
    this.loggedInUser = userDetails.firstName + ' ' +  userDetails.lastName;
  }

  openOD() {
    this.router.navigate(['operational-dashboard']);
  }
  openGD() {
    this.router.navigate(['gateway-dashboard'])
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordComponent, {
      data: {
      }
    })
  }

  logout() {
    this.loginService.logout().subscribe((res: any) => {
        this.router.navigateByUrl("login");
    })
  }
}
