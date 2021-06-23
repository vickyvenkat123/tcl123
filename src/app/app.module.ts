import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Modules/Components/login/login.component';
import { CustomerConfigComponent } from './Modules/Components/customer-config/customer-config.component';
import { HeaderComponent } from './shared/Components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerComponent } from './Modules/Components/customer-config/customer/customer.component';
import { CityComponent } from './Modules/Components/customer-config/city/city.component';
import { PlantComponent } from './Modules/Components/plant/plant.component';
import { SiteComponent } from './Modules/Components/site/site.component';
import { ResetPasswordComponent } from './Modules/Components/reset-password/reset-password.component';
import { OperationalDashboardComponent } from './Modules/Components/Dashboards/operational-dashboard/operational-dashboard.component';
import { ForgotPasswordComponent } from './Modules/Components/forgot-password/forgot-password.component';
import { ChartsModule } from 'ng2-charts';
import { GatewayDashboardComponent } from './Modules/Components/Dashboards/gateway-dashboard/gateway-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
// import {MatNativeDateModule} from '@angular/material';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatNativeDateModule } from '@angular/material/core';
import { AgGridModule } from 'ag-grid-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BeaconListModalComponent } from './Modules/Components/Dashboards/operational-dashboard/beacon-list-modal/beacon-list-modal.component';
import { ZoneDashboardComponent } from './Modules/Components/Dashboards/zone-dashboard/zone-dashboard.component';
import { HomeComponent } from './Modules/Components/home/home.component';
import { ErrorModalComponent } from './Modules/Components/error-modal/error-modal.component';
import { ChangePasswordComponent } from './Modules/Components/change-password/change-password.component';
import { LeftNavigationComponent } from './shared/Components/left-navigation/left-navigation.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { EmployeeTrackingComponent } from './Modules/Components/Dashboards/employee-tracking/employee-tracking.component';
import { UtilizationDashboardComponent } from './Modules/Components/Dashboards/utilization-dashboard/utilization-dashboard.component';
import { ExecutiveDashboardComponent } from './Modules/Components/executive-dashboard/executive-dashboard.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DateRangeComponent } from './shared/Components/date-range/date-range.component';
import { OtpVerificationComponent } from './shared/Components/otp-verification/otp-verification.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { KpiComponent } from './Modules/Components/Dashboards/kpi/kpi.component';
import 'hammerjs';
import { PinchZoomComponent } from './shared/Components/pinch-zoom/pinch-zoom.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BeaconLastCommunicationComponent } from './Modules/Components/tracking/beacon-last-communication/beacon-last-communication.component';
import { ZoneViolationComponent } from './Modules/Components/tracking/zone-violation/zone-violation.component';
import { AlertRuleComponent } from './Modules/Components/customer-config/alert-rule/alert-rule.component';
import { ViewAlertRuleComponent } from './Modules/Components/customer-config/alert-rule/view-alert-rule/view-alert-rule.component';
import { ChangeRuleStatusComponent } from './Modules/Components/customer-config/alert-rule/change-rule-status/change-rule-status.component';
import { UserLogsComponent } from './Modules/Components/tracking/user-logs/user-logs.component';
import { NotificationComponent } from './Modules/Components/alerts/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerConfigComponent,
    HeaderComponent,
    CustomerComponent,
    CityComponent,
    PlantComponent,
    SiteComponent,
    ResetPasswordComponent,
    OperationalDashboardComponent,
    ForgotPasswordComponent,
    GatewayDashboardComponent,
    BeaconListModalComponent,
    ZoneDashboardComponent,
    HomeComponent,
    ErrorModalComponent,
    ChangePasswordComponent,
    LeftNavigationComponent,
    EmployeeTrackingComponent,
    UtilizationDashboardComponent,
    ExecutiveDashboardComponent,
    DateRangeComponent,
    OtpVerificationComponent,
    KpiComponent,
    PinchZoomComponent,
    BeaconLastCommunicationComponent,
    ZoneViolationComponent,
    AlertRuleComponent,
    ViewAlertRuleComponent,
    ChangeRuleStatusComponent,
    UserLogsComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    AgGridModule.withComponents([]),
    NgxPaginationModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    Daterangepicker,
    NgOtpInputModule,
    NgxPermissionsModule.forRoot()

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
