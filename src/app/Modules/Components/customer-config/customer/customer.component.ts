import { Component, Input, OnInit } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer-details.model';
import { Template } from 'src/app/shared/models/template.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {


  constructor() { }
  @Input() customer: any;
  @Input() templates: any;
  @Input() editCustomerFlag: any;
  showGeneralDetails: boolean = true;
  showAddressDetails: boolean = false;
  showConfigDetails: boolean = false;
  showRoleDetails: boolean = false;
  showRuleDetails: boolean = false;
  showColorDetails: boolean = false;
  showSoSAlert: boolean = true;
  showHazardousAlert: boolean = false;
  showBatteryAlert: boolean = false;
  sosTemplates: any;
  hazardousTemplates: any;
  batteryTemplates: any;
  showDialog: boolean = false;
  templateData: string = "";
  ngOnInit(): void {
  }

  showGeneral() {
    this.showGeneralDetails = true;
    this.showAddressDetails = false;
    this.showConfigDetails = false;
    this.showRoleDetails = false;
    this.showRuleDetails = false;
    this.showColorDetails = false;
  }
  showAddress() {
    this.showGeneralDetails = false;
    this.showAddressDetails = true;
    this.showConfigDetails = false;
    this.showRoleDetails = false;
    this.showRuleDetails = false;
    this.showColorDetails = false;
  }
  showConfig() {
    this.showGeneralDetails = false;
    this.showAddressDetails = false;
    this.showConfigDetails = true;
    this.showSoS();
    this.showRoleDetails = false;
    this.showRuleDetails = false;
    this.showColorDetails = false;
  }
  showRole() {
    this.showGeneralDetails = false;
    this.showAddressDetails = false;
    this.showConfigDetails = false;
    this.showRoleDetails = true;
    this.showRuleDetails = false;
    this.showColorDetails = false;
  }
  showRule() {
    this.showGeneralDetails = false;
    this.showAddressDetails = false;
    this.showConfigDetails = false;
    this.showRoleDetails = false;
    this.showRuleDetails = true;
    this.showColorDetails = false;
  }
  showColor() {
    this.showGeneralDetails = false;
    this.showAddressDetails = false;
    this.showConfigDetails = false;
    this.showRoleDetails = false;
    this.showRuleDetails = false;
    this.showColorDetails = true;
  }

  showSoS() {
    this.sosTemplates = new Array<Template>();
    if (this.templates.length > 0) {
      this.templates.forEach((template: { subject: any; }) => {
        if (template.subject == "SOS Alert") {
          this.sosTemplates.push(template);
        }
      });
    }
    this.showSoSAlert = true;
    this.showHazardousAlert = false;
    this.showBatteryAlert = false;
  }

  showHazardous() {
    this.hazardousTemplates = new Array<Template>();
    if (this.templates.length > 0) {
      this.templates.forEach((template: { subject: any; }) => {
        if (template.subject == "Hazardous Alert") {
          this.hazardousTemplates.push(template);
        }
      });
    }
    this.showSoSAlert = false;
    this.showHazardousAlert = true;
    this.showBatteryAlert = false;
  }

  showBattery() {
    this.batteryTemplates = new Array<Template>();
    if (this.templates.length > 0) {
      this.templates.forEach((template: { subject: any; }) => {
        if (template.subject == "Battery Health Alert") {
          this.batteryTemplates.push(template);
        }
      });
    }
    this.showSoSAlert = false;
    this.showHazardousAlert = false;
    this.showBatteryAlert = true;
  }

  showDetailsOfTemplate(template: string) {
    this.showDialog = true;
    template = this.replaceValues(template);
    this.templateData = template;
  }

  replaceValues(template: string) {
    //template = template.replace("${model.deviceId}", "70b3d5f830000b3d");
    template = template.replace("${model.iotServerDateTimeStamp}", "12-08-202010:16:40");
    template = template.replace("${model.employeeName} #if($model.zoneName && $model.zoneType && $model.siteName)", "DemoUsr-001");
    template = template.replace("${model.zoneName} (${model.zoneType})", "L3# Furnace (Acidic)");
    template = template.replace("${model.siteName}.#end #if($model.lastKnownZone && $model.lastKnownSite)", "BNG Site");
    template = template.replace("${model.lastKnownZone}", "L3# Furnace");
    template = template.replace("${model.lastKnownSite}.#end", "BNG Site");
    template = template.replace("${model.alertName}", "undefined");
    template = template.replace("${model.deviceId}", "70b3d5f830000b3d");
    template = template.replace("${model.employeeName}", "DemoUsr-001");
    template = template.replace("${model.zoneName}", "L3# Furnace");
    template = template.replace("${model.batteryPercentage}", "80");
    template = template.replace("#if($model.zoneName && $model.zoneType && $model.siteName)", "");
    template = template.replace("${model.zoneType}", "Acidic");
    template = template.replace("${model.siteName}", "BNG Site");
    template = template.replace(".#end#if($model.lastKnownZone && $model.lastKnownSite)", "");
    template = template.replace("#if($model.zoneName)", "");
    template = template.replace("#end #if($model.zoneType)", " ");
    template = template.replace("#end #if($model.siteName)", " ");
    template = template.replace(".#end", "");
    template = template.replace("#if($model.zoneName && $model.zoneType)", "");
    template = template.replace("#end #if($model.lastKnownZone && $model.lastKnownSite)", "");
    template = template.replace("${model.lastKnownSite}", "");
    template = template.replace("#if(", "");
    template = template.replace("#end", "");
    return template;
  }

  save(){
    
  }

}
