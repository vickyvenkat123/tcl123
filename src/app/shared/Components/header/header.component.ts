import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ChangePasswordComponent } from 'src/app/Modules/Components/change-password/change-password.component';
import { NotificationDto } from '../../models/notification-dto.model';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { interval } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: any;
  notificationDto:NotificationDto = new   NotificationDto();
  subscription: Subscription;
  constructor(private router: Router, private dialog: MatDialog, private loginService: LoginService, private dashboardService: DashboardService) { 
    this.subscription = interval(10000).subscribe((val) => { 
      this.dashboardService.getAlertsCount().subscribe((res: any) => {
        this.notificationDto = res.data;
    })
    });
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("userId")==="")
    this.router.navigate(["/login"]);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || '{}');
    this.loggedInUser = userDetails.firstName + ' ' + userDetails.lastName;
    
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
      sessionStorage.clear();
      this.router.navigateByUrl("login");
    })
  }

  openNotification() {
    this.router.navigateByUrl("notification");
  }
}
