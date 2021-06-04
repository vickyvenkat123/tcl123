import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HierarchyService } from 'src/app/core/services/hierarchy.service';
import { Beacon } from 'src/app/shared/models/beacon.model';

@Component({
  selector: 'app-beacon-list-modal',
  templateUrl: './beacon-list-modal.component.html',
  styleUrls: ['./beacon-list-modal.component.css']
})
export class BeaconListModalComponent implements OnInit {

  beaconList: Beacon[]= new Array<Beacon>();
  constructor(public dialogRef: MatDialogRef<BeaconListModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private hierarchyService: HierarchyService
  ) {
  }
  public closeMe() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.hierarchyService.getBeaconDetailsByZoneAndSiteId(this.data.siteId, this.data.zoneId).subscribe((res: any) => {
        this.beaconList = res.data;
    })
  }

}
