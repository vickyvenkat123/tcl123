import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {

  showDashboard: boolean = false;
  showTracking: boolean = false;
  showAlerts: boolean = false;
  check: boolean = false;
  
  constructor(private _permissionService: NgxPermissionsService) { }

  ngOnInit(): void {
  }
  
  showHideNavigation(type:string) {
    if(type === "dashboard"){
      this.showTracking = false;
      this.showDashboard = !this.showDashboard; 
      
    }
    if(type === "tracking"){
      this.showDashboard = false;
      this.showTracking = !this.showTracking; 
    }
    // this.isShownNav = !this.isShownNav;
    // if (this.check == false) {
    //   this.check = true;
    // } else {
    //   this.check = false;
    // }
  }
}
