import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerConfigComponent } from './Modules/Components/customer-config/customer-config.component';
import { GatewayDashboardComponent } from './Modules/Components/Dashboards/gateway-dashboard/gateway-dashboard.component';
import { OperationalDashboardComponent } from './Modules/Components/Dashboards/operational-dashboard/operational-dashboard.component';
import { ZoneDashboardComponent } from './Modules/Components/Dashboards/zone-dashboard/zone-dashboard.component';
import { ForgotPasswordComponent } from './Modules/Components/forgot-password/forgot-password.component';
import { LoginComponent } from './Modules/Components/login/login.component';
import { ResetPasswordComponent } from './Modules/Components/reset-password/reset-password.component';
import { UtilizationDashboardComponent } from './Modules/Components/Dashboards/utilization-dashboard/utilization-dashboard.component';
import { EmployeeTrackingComponent } from './Modules/Components/Dashboards/employee-tracking/employee-tracking.component';
import { ExecutiveDashboardComponent } from './Modules/Components/executive-dashboard/executive-dashboard.component';
import { OtpVerificationComponent } from './shared/Components/otp-verification/otp-verification.component';
import { KpiComponent } from './Modules/Components/Dashboards/kpi/kpi.component';
import { AuthGuard } from './core/auth.guard';
import { BeaconLastCommunicationComponent } from './Modules/Components/tracking/beacon-last-communication/beacon-last-communication.component';
import { ZoneViolationComponent } from './Modules/Components/tracking/zone-violation/zone-violation.component';
import { AlertRuleComponent } from './Modules/Components/customer-config/alert-rule/alert-rule.component';
import { UserLogsComponent } from './Modules/Components/tracking/user-logs/user-logs.component';
import { NotificationComponent } from './Modules/Components/alerts/notification/notification.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'customerconfiguration', component: CustomerConfigComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'operational-dashboard', canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_DASHBOARD_VIEW',
      }
    },
    component: OperationalDashboardComponent
  },
  {
    path: 'live-zone', canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_ZONE_DASHBOARD',
      }
    }, component: ZoneDashboardComponent
  },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  {
    path: 'gateway-dashboard',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_NETWORK_GATEWAY_DASHBOARD',
      }
    }, component: GatewayDashboardComponent
  },
  {
    path: 'card-utilization',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_SURAKSHA_CARD',
      }
    },
    component: UtilizationDashboardComponent
  },
  {
    path: 'track-employee',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: ['ROLE_EMPLOYEE_LOCATION_TRACKING', 'ROLE_EMPLOYEE_BEACON_TRACKING', 'ROLE_EMPLOYEE_MAP_TRACKING'],
      }
    }, component: EmployeeTrackingComponent
  },
  {
    path: 'executive-dashboard', canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_EXECUTIVE_DASHBOARD',
      }
    },
    component: ExecutiveDashboardComponent,
    children: []
  },
  { path: 'otp-verification', component: OtpVerificationComponent },

  {
    path: 'kpi',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_KPI DASHBOARD',
      }
    }, component: KpiComponent
  },
  {
    path: 'beacon-last-communication',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_BEACON_LAST_COMMUNICATION_VIEW',
      }
    }, component: BeaconLastCommunicationComponent
  },
  {
    path: 'zone-violation',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_ZONE_VIOLATION',
      }
    }, component: ZoneViolationComponent
  },
  {
    path: 'alertrule',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_USER_ALERT_RULE_CONFIGURATION',
      }
    }, component: AlertRuleComponent
  },
  {
    path: 'user-tracking',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: 'ROLE_USER_LOGS_VIEW',
      }
    }, component: UserLogsComponent
  },
  {
    path: 'notification',
    canActivate: [AuthGuard],
    data: {
      Permissions: {
        Only: ['ROLE_NOTIFICATION_VIEW','ROLE_NOTIFICATION_ACTION']
      }
    }, component: NotificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
