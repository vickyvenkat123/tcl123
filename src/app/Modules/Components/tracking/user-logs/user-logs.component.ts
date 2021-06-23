import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.css']
})
export class UserLogsComponent implements OnInit {

  constructor() { }
  searchLog:string = "";

  ngOnInit(): void {}

  filterLogData(){}
}
