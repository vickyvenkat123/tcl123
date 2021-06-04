import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerConfigComponent } from './Modules/Components/customer-config/customer-config.component';
import { GatewayDashboardComponent } from './Modules/Components/Dashboards/gateway-dashboard/gateway-dashboard.component';
import { OperationalDashboardComponent } from './Modules/Components/Dashboards/operational-dashboard/operational-dashboard.component';
import { ZoneDashboardComponent } from './Modules/Components/Dashboards/zone-dashboard/zone-dashboard.component';
import { ForgotPasswordComponent } from './Modules/Components/forgot-password/forgot-password.component';
import { LoginComponent } from './Modules/Components/login/login.component';
import { ResetPasswordComponent } from './Modules/Components/reset-password/reset-password.component';
import { UtilizationDashboardComponent } from './Modules/Components/utilization-dashboard/utilization-dashboard.component';
import { EmployeeTrackingComponent } from './Modules/Components/Dashboards/employee-tracking/employee-tracking.component';
import { ExecutiveDashboardComponent } from './Modules/Components/executive-dashboard/executive-dashboard.component';
import { OtpVerificationComponent } from './shared/Components/otp-verification/otp-verification.component';
import { KpiComponent } from './Modules/Components/Dashboards/kpi/kpi.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customerconfiguration', component: CustomerConfigComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'operational-dashboard', component: OperationalDashboardComponent },
  { path: 'live-zone', component: ZoneDashboardComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'gateway-dashboard', component: GatewayDashboardComponent },
  { path: 'card-utilization', component: UtilizationDashboardComponent },
  { path: 'employee-tracking', component: EmployeeTrackingComponent },
  { path: 'executive-dashboard', component: ExecutiveDashboardComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'kpi', component:KpiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
