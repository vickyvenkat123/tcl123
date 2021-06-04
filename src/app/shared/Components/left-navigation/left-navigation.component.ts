import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {

  isShownNav: boolean = false;
  check: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  showHideNavigation() {
    this.isShownNav = !this.isShownNav;
    if (this.check == false) {
      this.check = true;
    } else {
      this.check = false;
    }
  }
}
