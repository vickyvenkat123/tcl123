import { Component, OnInit, ViewChild, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {

  constructor() { }
  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent | undefined;
  public options: any = {
    'locale': { 'format': 'DD-MM-YYYY', 'separator': ' to ' },
     'maxDate': new Date(),
  };

  @Output() selectDateRange = new EventEmitter();
  @Input() option?: any;
  public dateTextInput: any;
  public daterange: any = {};
  public selectedDate(value: any) {
    this.selectDateRange.emit(value);
    alert("hi");
  }
  startDate: any;
  endDate: any;
  // expected output is an object containing the event and the picker.
  // your method can be named whaterver you want.
  // you can add multiple params to the method and pass them in the template
  public calendarCanceled(e: any) {
    console.log(e);
    // e.event
    // e.picker
  }

  public calendarApplied(e: any) {
    console.log(e);
    // e.event;
    // e.picker; 
  }

  ngOnInit(): void {
    if (this.option) {
      this.options = this.option;
      if (this.option.startDate && this.option.endDate) {
        this.dateTextInput = moment(this.option.startDate).format('DD-MM-YYYY') + " to " + moment(this.option.endDate).format('DD-MM-YYYY');
      }
    }
  }

  ngOnChanges(properties:SimpleChanges) {
    var option = properties.option.currentValue;
      if(option && option.startDate && option.endDate && this.picker && this.picker.datePicker){
        //this.options = option;
        this.picker.datePicker.setStartDate(moment(option.startDate).toDate());
        this.picker.datePicker.setEndDate(moment(option.endDate).toDate());
      }
  }
}
