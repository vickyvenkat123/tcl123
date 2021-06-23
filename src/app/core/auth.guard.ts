import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private permissionService: NgxPermissionsService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin(route);
  }

  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.loginService.isLoggedIn()) {
      var userDetails = JSON.parse(sessionStorage.getItem("userDetails") || '{}');
      if (userDetails && userDetails.userId) {

        this.permissionService.flushPermissions();
        var authorities = userDetails.authorities.map(function (item: any) {
          return item.authority;
        });
        this.permissionService.addPermission(authorities);

      }
      else {
        // if auth data does not validates redirect to login component.
        this.router.navigate(['/login']);
        return false;
      }
      if (authorities.indexOf(route.routeConfig?.data?.Permissions.Only) != -1) {
        return true;

      }
      else if (authorities.indexOf(route.routeConfig?.data?.Permissions.Only[0]) != -1) {
        return true;
      }
      else {
        console.log(route.routeConfig?.data?.Permissions.Only);
        this.router.navigate(['/login']);
        return false;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }

  addAuthorities() {
    if (this.loginService.isLoggedIn()) {
      var userDetails = JSON.parse(sessionStorage.getItem("userDetails") || '{}');
      if (userDetails && userDetails.userId) {
        this.permissionService.flushPermissions();
        var authorities = userDetails.authorities.map(function (item: any) {
          return item.authority;
        });
        this.permissionService.addPermission(authorities);
      }
    }
  }
}