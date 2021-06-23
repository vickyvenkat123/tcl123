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
  showCustomrConfig: boolean = false;
  check: boolean = false;

  constructor(private _permissionService: NgxPermissionsService) { }

  ngOnInit(): void {
  }

  showHideNavigation(type: string) {
    if (type === "dashboard") {
      this.showTracking = false;
      this.showCustomrConfig = false;
      this.showAlerts = false;
      this.showDashboard = !this.showDashboard;
    }
    else if (type === "tracking") {
      this.showDashboard = false;
      this.showCustomrConfig = false;
      this.showAlerts = false;
      this.showTracking = !this.showTracking;
    }
    else if (type === "customerConfig") {
      this.showDashboard = false;
      this.showTracking = false;
      this.showAlerts = false;
      this.showCustomrConfig = !this.showCustomrConfig;
    }
    else if (type === "alerts") {
      this.showDashboard = false;
      this.showTracking = false;
      this.showCustomrConfig = false;
      this.showAlerts = !this.showAlerts;
    }
  }
}