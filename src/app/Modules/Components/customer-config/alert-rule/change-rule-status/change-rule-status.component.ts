import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertRuleService } from 'src/app/core/alert-rule.service';
import { ErrorModalComponent } from '../../../error-modal/error-modal.component';

@Component({
  selector: 'app-change-rule-status',
  templateUrl: './change-rule-status.component.html',
  styleUrls: ['./change-rule-status.component.css']
})
export class ChangeRuleStatusComponent implements OnInit {
  status: string = "";

  constructor(public dialogRef: MatDialogRef<ChangeRuleStatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private alertRuleService: AlertRuleService, private dialog: MatDialog
  ) {}

  closeMe() {
    this.dialogRef.close();
  }

  changeStatus() {
    this.alertRuleService.updateAlertRuleStatus(this.data.status, this.data.ruleId, this.data.ruleName).
      subscribe((res: any) => {
        this.dialogRef.close();
        if (res.status === 200) {
          this.dialog.open(ErrorModalComponent, {
            data: {
              message: res.message,
              header: "Info",
              reload: "alertrule"
            }
          });
        }
      })
  }

  ngOnInit(): void {
    this.status = this.data.status ? "InActive" : "Active"
  }
}
